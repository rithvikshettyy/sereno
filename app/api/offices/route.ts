import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/db";
import { Office } from "@/models/Office";

export async function GET() {
  try {
    await connectDB();
    const offices = await Office.find({}).sort({ created_at: -1 });
    return NextResponse.json({ data: offices });
  } catch (err) {
    console.error("[Offices API] Error fetching offices:", err);
    return NextResponse.json({ error: "Failed to fetch offices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.office_id || !body.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check for duplicate office_id
    const existing = await Office.findOne({ office_id: body.office_id });
    if (existing) {
      return NextResponse.json({ error: "Office ID already exists" }, { status: 409 });
    }

    const office = await Office.create({
      office_id: body.office_id,
      name: body.name,
      location: body.location || "",
    });

    return NextResponse.json({ data: office }, { status: 201 });
  } catch (err) {
    console.error("[Offices API] Error creating office:", err);
    return NextResponse.json({ error: "Failed to create office" }, { status: 500 });
  }
}
