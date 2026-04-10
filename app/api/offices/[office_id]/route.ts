import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Office } from "@/models/Office";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ office_id: string }> }
) {
  const { office_id } = await params;
  try {
    await connectDB();
    const result = await Office.findOneAndDelete({ office_id });
    if (!result) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Office deleted successfully" });
  } catch (err) {
    console.error("[Offices API] Error deleting office:", err);
    return NextResponse.json({ error: "Failed to delete office" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ office_id: string }> }
) {
  const { office_id } = await params;
  try {
    await connectDB();
    const body = await req.json();
    const result = await Office.findOneAndUpdate({ office_id }, body, { new: true });
    if (!result) {
      return NextResponse.json({ error: "Office not found" }, { status: 404 });
    }
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("[Offices API] Error updating office:", err);
    return NextResponse.json({ error: "Failed to update office" }, { status: 500 });
  }
}
