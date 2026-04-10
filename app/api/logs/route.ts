import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db";
import { MessageLog } from "@/models/MessageLog";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sp = req.nextUrl.searchParams;
    const phone = sp.get("phone")?.trim() || null;
    const office_id = sp.get("office_id")?.trim() || null;
    const hasMedia = sp.get("has_media");
    const limitParam = parseInt(sp.get("limit") ?? "50", 10);
    const limit = isNaN(limitParam)
      ? 50
      : Math.min(Math.max(1, limitParam), 200);

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { direction: "inbound" };
    if (phone) {
      // Flexible match: with or without whatsapp: prefix
      const normalized = phone.replace("whatsapp:", "").trim();
      filter.phone = { $regex: normalized.replace(/[+]/g, "\\+"), $options: "i" };
    }
    if (office_id) {
      filter.office_id = office_id;
    }
    if (hasMedia === "true") {
      filter.media_count = { $gt: 0 };
    }

    const logs = await MessageLog.find(filter)
      .sort({ received_at: -1 })
      .limit(limit)
      .select("-raw_payload") // exclude large payload from list
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: logs.length,
        limit,
        data: logs,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[API/logs] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
