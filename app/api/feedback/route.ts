import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Feedback } from "@/models/Feedback";
import { MessageLog } from "@/models/MessageLog";
import { Office } from "@/models/Office";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sp = req.nextUrl.searchParams;
    const limitParam = parseInt(sp.get("limit") ?? "50", 10);
    const limit = isNaN(limitParam) ? 50 : Math.min(Math.max(1, limitParam), 200);

    // 1. Fetch completed feedbacks
    const completedFeedbacks = await Feedback.find({})
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    // 2. Fetch recent inbound messages (Live Trace) - Using unique variable name to avoid cache collisions
    const rawInteractionStream = await MessageLog.find({ direction: "inbound" })
      .sort({ received_at: -1 })
      .limit(limit)
      .lean();

    // 3. Resolve office names
    const allOfficeIds = [...new Set([
      ...completedFeedbacks.map(f => f.office_id),
      ...rawInteractionStream.map(m => m.office_id).filter(Boolean) as string[]
    ])];
    
    const offices = await Office.find({ office_id: { $in: allOfficeIds } }).lean();
    const officeMap = offices.reduce((acc, o) => {
      acc[o.office_id] = o.name;
      return acc;
    }, {} as Record<string, string>);

    // 4. Format Feedbacks
    const finalizedAudits = completedFeedbacks.map(f => ({
      _id: (f as any)._id.toString(),
      wa_id: f.phone,
      office_id: f.office_id,
      office_name: officeMap[f.office_id] || "Unknown Node",
      language: f.language,
      type: "feedback",
      data: {
        rating: f.rating,
        behavior: f.staff_feedback,
        suggestion: f.suggestion,
        visit: f.visit_confirmed ? "Yes" : "No",
        helpdesk: f.helpdesk_available ? "Yes" : "No"
      },
      created_at: (f as any).created_at,
    }));

    // 5. Format Live Logs
    const messageTrace = rawInteractionStream.map(m => ({
      _id: (m as any)._id.toString(),
      wa_id: m.phone,
      office_id: m.office_id || "Global",
      office_name: m.office_id ? (officeMap[m.office_id] || "Active Node") : "General",
      type: "log",
      data: {
        body: m.raw_body,
        msg_type: m.message_type,
        media: m.media_count
      },
      created_at: m.received_at,
    }));

    return NextResponse.json(
      {
        success: true,
        feedbacks: finalizedAudits,
        logs: messageTrace
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[API/Feedback] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
