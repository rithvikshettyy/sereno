import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Session } from "@/models/Session";
import { MessageLog } from "@/models/MessageLog";
import { processMessage, FlowState, getInitialMessage } from "@/lib/stateMachine";
import twilio from "twilio";

// Resolve office_id from the prefilled WhatsApp message body
function resolveOfficeId(body: string): string | null {
  const match = body.match(/ID:\s*([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Determine message type
function classifyMessage(
  body: string,
  mediaCount: number,
  buttonText?: string
): "text" | "interactive" | "media" {
  if (mediaCount > 0) return "media";
  if (buttonText) return "interactive";
  return "text";
}

// Sanitize Twilio payload: remove sensitive fields
function sanitizePayload(form: FormData): Record<string, unknown> {
  const safe: Record<string, unknown> = {};
  const forbidden = ["AccountSid", "AuthToken"];
  form.forEach((val, key) => {
    if (!forbidden.includes(key)) {
      safe[key] = val;
    }
  });
  return safe;
}

export async function POST(req: NextRequest) {
  // Always respond to Twilio quickly (within 10s)
  const startTime = Date.now();

  try {
    await connectDB();

    const form = await req.formData();

    const From = form.get("From")?.toString() ?? "";
    const Body = form.get("Body")?.toString() ?? "";
    const MessageSid = form.get("MessageSid")?.toString() ?? null;
    const NumMedia = parseInt(form.get("NumMedia")?.toString() ?? "0", 10);
    const ButtonText = form.get("ButtonText")?.toString() ?? undefined;
    const ListReplyId = form.get("ListReplyId")?.toString() ?? undefined;
    const ListReplyTitle = form.get("ListReplyTitle")?.toString() ?? undefined;

    // Normalize phone
    const phone = From.replace("whatsapp:", "").trim();
    const normalizedBody = Body.trim().toLowerCase();

    // Resolve office_id from body or session
    let sessionOfficeId: string | null = null;
    let session = await Session.findOne({ phone });
    if (session) {
      sessionOfficeId = session.office_id;
    }
    const resolvedOfficeId =
      resolveOfficeId(Body) || sessionOfficeId || null;

    // Collect media items
    const mediaItems: { url: string; mime_type: string }[] = [];
    for (let i = 0; i < NumMedia; i++) {
      const url = form.get(`MediaUrl${i}`)?.toString() ?? "";
      const mime = form.get(`MediaContentType${i}`)?.toString() ?? "";
      if (url) mediaItems.push({ url, mime_type: mime });
    }

    // ── STEP 1: Capture raw inbound log (idempotent) ──────────────────
    try {
      await MessageLog.create({
        phone,
        office_id: resolvedOfficeId,
        twilio_message_sid: MessageSid,
        raw_body: Body,
        normalized_body: normalizedBody,
        button_text: ButtonText,
        list_reply_id: ListReplyId,
        list_reply_title: ListReplyTitle,
        media_count: NumMedia,
        media_items: mediaItems,
        message_type: classifyMessage(Body, NumMedia, ButtonText),
        source_channel: "whatsapp",
        direction: "inbound",
        received_at: new Date(),
        raw_payload: sanitizePayload(form),
      });
    } catch (err: unknown) {
      // Duplicate MessageSid – already processed, skip silently
      if ((err as { code?: number })?.code === 11000) {
        console.warn(`[Webhook] Duplicate MessageSid skipped: ${MessageSid}`);
        return twimlResponse(""); // Empty TwiML = no duplicate reply
      }
      throw err;
    }

    // ── STEP 2: Run state machine ─────────────────────────────────────
    let currentState: FlowState = "start";
    let currentLang = "en";

    // Scenario A: QR Scan detected (contains ID:) - Reset flow
    const isNewQrScan = Body.includes("ID:");

    if (isNewQrScan && resolvedOfficeId) {
      if (!session) {
        session = await Session.create({
          phone,
          office_id: resolvedOfficeId,
          state: "start",
          language: "en",
          data: {},
        });
      } else {
        session.office_id = resolvedOfficeId;
        session.state = "start";
        session.language = "en";
        session.data = {};
        await session.save();
      }
      return twimlResponse(getInitialMessage("en"));
    }

    // Scenario B: Normal message and no session exists
    if (!session) {
      return twimlResponse(
        "👋 Welcome! Please scan a Sereno QR code at a government office to begin."
      );
    }

    currentState = session.state as FlowState;
    currentLang = session.language;

    // Detect language selection in start state
    if (currentState === "start") {
      if (normalizedBody === "1" || normalizedBody.includes("marathi") || normalizedBody.includes("मराठी")) {
        currentLang = "mr";
      } else if (normalizedBody === "3" || normalizedBody.includes("hindi") || normalizedBody.includes("हिंदी")) {
        currentLang = "hi";
      } else {
        currentLang = "en";
      }
    }

    const { body: replyBody, nextState } = processMessage(
      currentState,
      currentLang,
      Body
    );

    // Persist state data
    const updatedData = {
      ...((session.data as Record<string, unknown>) || {}),
    };

    // Correct mapping based on the *current* state we're processing Body for:
    if (currentState === "language") {
      updatedData.visit_confirmed =
        normalizedBody === "1" ||
        normalizedBody.includes("yes") ||
        normalizedBody.includes("हो");
    } else if (currentState === "confirm_visit") {
      const rating = parseInt(normalizedBody, 10);
      if (!isNaN(rating)) updatedData.rating = rating;
    } else if (currentState === "rate_experience") {
      updatedData.helpdesk_available =
        normalizedBody === "1" ||
        normalizedBody.includes("yes") ||
        normalizedBody.includes("हो");
    } else if (currentState === "helpdesk") {
      updatedData.staff_behavior = Body;
    } else if (currentState === "staff_feedback") {
      updatedData.suggestion = Body;
    }

    // Complete feedback recording
    if (nextState === "done") {
      try {
        const { Feedback } = await import("@/models/Feedback");
        await Feedback.create({
          phone,
          office_id: resolvedOfficeId as string,
          language: currentLang,
          visit_confirmed: updatedData.visit_confirmed as boolean,
          rating: updatedData.rating as number,
          helpdesk_available: updatedData.helpdesk_available as boolean,
          staff_feedback: updatedData.staff_behavior as string,
          suggestion: updatedData.suggestion as string,
        });
        console.log(`[Webhook] Recorded feedback for ${phone} | Office: ${resolvedOfficeId}`);
      } catch (fErr) {
        console.error("[Webhook] Failed to save feedback model:", fErr);
      }
    }

    await Session.updateOne(
      { phone },
      {
        state: nextState,
        language: currentLang,
        data: updatedData,
      }
    );

    console.log(
      `[Webhook] ${phone} | ${currentState} → ${nextState} | ${Date.now() - startTime}ms`
    );

    return twimlResponse(replyBody);
  } catch (err) {
    console.error("[Webhook] Error:", err);
    // Always return valid TwiML so Twilio doesn't retry endlessly
    return twimlResponse(
      "We're experiencing technical difficulties. Please try again shortly."
    );
  }
}

function twimlResponse(message: string) {
  const xml = message
    ? `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(message)}</Message>
</Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
