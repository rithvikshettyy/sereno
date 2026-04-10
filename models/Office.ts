import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOffice extends Document {
  office_id: string;
  name: string;
  location: string;
  created_at: Date;
}

const OfficeSchema = new Schema<IOffice>(
  {
    office_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    location: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at" } }
);

export const Office: Model<IOffice> =
  mongoose.models.Office ||
  mongoose.model<IOffice>("Office", OfficeSchema);
