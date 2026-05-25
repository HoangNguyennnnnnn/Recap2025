import mongoose, { Schema, Document } from 'mongoose';

export type FortuneSourceStatus = 'pending' | 'ready' | 'failed';

export interface IFortuneSource extends Document {
  profileSlug: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageProvider: 'cloudinary' | 'external';
  status: FortuneSourceStatus;
  extractedTextLength?: number;
  chunkCount?: number;
  ingestedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FortuneSourceSchema = new Schema<IFortuneSource>(
  {
    profileSlug: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
    },
    storageProvider: {
      type: String,
      required: true,
      enum: ['cloudinary', 'external'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'ready', 'failed'],
      default: 'pending',
    },
    extractedTextLength: {
      type: Number,
    },
    chunkCount: {
      type: Number,
    },
    ingestedAt: {
      type: Date,
    },
    error: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FortuneSource = mongoose.model<IFortuneSource>('FortuneSource', FortuneSourceSchema);
