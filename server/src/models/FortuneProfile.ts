import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFortuneProfile extends Document {
  slug: string;
  displayName: string;
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  sourceIds: Types.ObjectId[];
  lastIngestAt?: Date;
  /** Full cleaned text extracted from PDF — used as context for Q&A */
  fullText?: string;
  /** Fully parsed FortuneResult stored after ingest — served directly without re-generating */
  parsedResult?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const FortuneProfileSchema = new Schema<IFortuneProfile>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: String,
      trim: true,
    },
    birthTime: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    sourceIds: {
      type: [{ type: Schema.Types.ObjectId, ref: 'FortuneSource' }],
      default: [],
    },
    lastIngestAt: {
      type: Date,
    },
    fullText: {
      type: String,
    },
    parsedResult: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export const FortuneProfile = mongoose.model<IFortuneProfile>(
  'FortuneProfile',
  FortuneProfileSchema
);
