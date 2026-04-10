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

    // 2. Fetch recent inbound messages to provide a "Live" feel
    // We filter for direction: inbound and exclude those that are purely QR scans if possible
    const liveMessages = await MessageLog.find({ direction: "inbound" })
      .sort({ received_at: -1 })
      .limit(limit)
      .lean();

    // 3. Resolve office names for all
    const allOfficeIds = [...new Set([
      ...completedFeedbacks.map(f => f.office_id),
      ...liveMessages.map(m => m.office_id).filter(Boolean) as string[]
    ])];
    
    const offices = await Office.find({ office_id: { $in: allOfficeIds } }).lean();
    const officeMap = offices.reduce((acc, o) => {
      acc[o.office_id] = o.name;
      return acc;
    }, {} as Record<string, string>);

    // 4. Transform Feedbacks into the display format
    const formattedCompleted = completedFeedbacks.map(f => ({
      _id: (f as any)._id.toString(),
      wa_id: f.phone,
      office_id: f.office_id,
      office_name: officeMap[f.office_id] || "Unknown Node",
      language: f.language,
      is_completed: true,
      feedback_data: {
        visit_purpose: f.visit_confirmed ? "Confirmed Visit" : "No Visit",
        waiting_time: f.helpdesk_available ? "Helpdesk Used" : "No Helpdesk",
        staff_behavior: f.staff_feedback || "No feedback provided",
        overall_rating: f.rating || 0,
        additional_comments: f.suggestion || "",
      },
      created_at: (f as any).created_at,
    }));

    // 5. Transform Live Messages into the display format
    // We deduplicate by phone if it's already in completed in the same window, but for simplicity we show all
    const formattedLive = liveMessages.map(m => ({
      _id: (m as any)._id.toString(),
      wa_id: m.phone,
      office_id: m.office_id || "Unassigned",
      office_name: m.office_id ? (officeMap[m.office_id] || "Active Node") : "General Chat",
      language: "...",
      is_completed: false,
      feedback_data: {
        visit_purpose: "Messaging...",
        waiting_time: m.media_count > 0 ? "Media shared" : "Text sent",
        staff_behavior: "Conversation in progress",
        overall_rating: 0,
        additional_comments: m.raw_body,
      },
      created_at: m.received_at,
    }));

    // Combine and sort by date
    const combined = [...formattedCompleted, ...formattedLive]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        count: combined.length,
        data: combined,
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
