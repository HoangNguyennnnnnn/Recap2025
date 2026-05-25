import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFortuneChunk extends Document {
  profileSlug: string;
  sourceId: Types.ObjectId;
  order: number;
  text: string;
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

const FortuneChunkSchema = new Schema<IFortuneChunk>(
  {
    profileSlug: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      ref: 'FortuneSource',
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

FortuneChunkSchema.index({ profileSlug: 1, sourceId: 1, order: 1 });

export const FortuneChunk = mongoose.model<IFortuneChunk>('FortuneChunk', FortuneChunkSchema);
