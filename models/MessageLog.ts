import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaItem {
  url: string;
  mime_type: string;
}

export interface IMessageLog extends Document {
  phone: string;
  office_id: string | null;
  twilio_message_sid: string | null;
  raw_body: string;
  normalized_body: string;
  // Interactive / button fields
  button_text?: string;
  list_reply_id?: string;
  list_reply_title?: string;
  // Media
  media_count: number;
  media_items: IMediaItem[];
  // Classification
  message_type: "text" | "interactive" | "media";
  source_channel: "whatsapp";
  direction: "inbound";
  received_at: Date;
  // Safe payload snapshot
  raw_payload: Record<string, unknown>;
}

const MediaItemSchema = new Schema<IMediaItem>(
  {
    url: String,
    mime_type: String,
  },
  { _id: false }
);

const MessageLogSchema = new Schema<IMessageLog>(
  {
    phone: { type: String, required: true, index: true },
    office_id: { type: String, default: null, index: true },
    twilio_message_sid: { type: String, default: null, sparse: true },
    raw_body: { type: String, default: "" },
    normalized_body: { type: String, default: "" },
    button_text: String,
    list_reply_id: String,
    list_reply_title: String,
    media_count: { type: Number, default: 0 },
    media_items: { type: [MediaItemSchema], default: [] },
    message_type: {
      type: String,
      enum: ["text", "interactive", "media"],
      default: "text",
    },
    source_channel: { type: String, default: "whatsapp" },
    direction: { type: String, default: "inbound" },
    received_at: { type: Date, default: Date.now },
    raw_payload: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: false }
);

// Deduplicate: unique sparse index on MessageSid
MessageLogSchema.index(
  { twilio_message_sid: 1 },
  { unique: true, sparse: true }
);

export const MessageLog: Model<IMessageLog> =
  mongoose.models.MessageLog ||
  mongoose.model<IMessageLog>("MessageLog", MessageLogSchema);
