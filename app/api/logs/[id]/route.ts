import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db";
import { MessageLog } from "@/models/MessageLog";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const log = await MessageLog.findById(id).lean();
    if (!log) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: log });
  } catch (err) {
    console.error("[API/logs/:id]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
