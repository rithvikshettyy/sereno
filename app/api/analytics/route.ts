import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Feedback } from "@/models/Feedback";
import { Office } from "@/models/Office";

export async function GET() {
  try {
    await connectDB();

    // Overall stats
    const total_feedback = await Feedback.countDocuments();
    const total_offices = await Office.countDocuments();

    // Average rating
    const avgRatingAgg = await Feedback.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const average_rating = avgRatingAgg.length > 0 ? avgRatingAgg[0].avgRating : 0;

    // Rating distribution [1-5]: aggregate
    const ratingDist = await Feedback.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Format for chart: [{ name: '5 Star', count: 12 }, ...]
    const ratings = [1, 2, 3, 4, 5].map((r) => {
      const found = ratingDist.find((d) => d._id === r);
      return { rating: r, count: found ? found.count : 0 };
    });

    // Language distribution
    const langDist = await Feedback.aggregate([
      { $group: { _id: "$language", count: { $sum: 1 } } },
    ]);

    // Helpdesk availability
    const helpdeskStats = await Feedback.aggregate([
      { $match: { helpdesk_available: { $exists: true } } },
      { $group: { _id: "$helpdesk_available", count: { $sum: 1 } } },
    ]);

    // Feedback by Office
    const officeFeedback = await Feedback.aggregate([
      { $group: { _id: "$office_id", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Join with Office names
    const enrichOfficeFeedback = await Promise.all(
      officeFeedback.map(async (of) => {
        const office = await Office.findOne({ office_id: of._id });
        return {
          office_id: of._id,
          name: office ? office.name : of._id,
          count: of.count,
          avgRating: of.avgRating ? Number(of.avgRating.toFixed(1)) : 0,
        };
      })
    );

    return NextResponse.json({
      data: {
        total_feedback,
        total_offices,
        average_rating,
        ratings,
        languages: langDist.map((l) => ({ name: l._id === "mr" ? "Marathi" : "English", value: l.count })),
        helpdesk: helpdeskStats.map((h) => ({ name: h._id ? "Available" : "Not Available", value: h.count })),
        topOffices: enrichOfficeFeedback,
      },
    });
  } catch (err) {
    console.error("[Analytics API] Error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
