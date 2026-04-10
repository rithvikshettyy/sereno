import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

import { connectDB } from "@/lib/db";
import { Office } from "@/models/Office";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ office_id: string }> }
) {
  const { office_id } = await params;

  // Validate office_id against DB
  await connectDB();
  const office = await Office.findOne({ office_id });
  if (!office) {
    return NextResponse.json(
      {
        error: "Office not found",
        office_id,
        message: `No office with id '${office_id}' exists in our records.`,
      },
      { status: 404 }
    );
  }

  // Build WhatsApp deep link with prefilled message
  const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER?.replace(
    "whatsapp:",
    ""
  ).replace("+", "");

  // Fallback to Twilio sandbox number for dev
  const phoneNumber = twilioNumber || "14155238886";
  const greeting = encodeURIComponent(
    `Hi! I'm at ${office.name} (${office.location}). ID: ${office_id}`
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${greeting}`;

  // Detect desired format
  const format = req.nextUrl.searchParams.get("format") || "png";

  try {
    if (format === "svg") {
      const svg = await QRCode.toString(waUrl, {
        type: "svg",
        errorCorrectionLevel: "M",
      });
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // Default: PNG
    const buffer = await QRCode.toBuffer(waUrl, {
      type: "png",
      errorCorrectionLevel: "M",
      margin: 2,
      width: 400,
    });

    return new Response(buffer as any, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
        "Content-Disposition": `inline; filename="qr-${office_id}.png"`,
      },
    });
  } catch (err) {
    console.error("[QR] Error generating QR:", err);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
