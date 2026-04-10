import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession extends Document {
  phone: string;
  office_id: string;
  state: string;
  language: string;
  data: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    office_id: { type: String, required: true, index: true },
    state: { type: String, default: "start" },
    language: { type: String, default: "en" },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Session: Model<ISession> =
  mongoose.models.Session ||
  mongoose.model<ISession>("Session", SessionSchema);
