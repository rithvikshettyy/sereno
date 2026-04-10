import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
  office_id: string;
  phone: string;
  language: string;
  visit_confirmed?: boolean;
  rating?: number;
  helpdesk_available?: boolean;
  staff_feedback?: string;
  suggestion?: string;
  created_at: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    office_id: { type: String, required: true, index: true },
    phone: { type: String, required: true, index: true },
    language: { type: String, default: "en" },
    visit_confirmed: { type: Boolean },
    rating: { type: Number },
    helpdesk_available: { type: Boolean },
    staff_feedback: { type: String },
    suggestion: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);
