import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  memoryId: mongoose.Types.ObjectId;
  content: string;
  author: string;
  timestamp: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    memoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Memory',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Using custom timestamp field
  }
);

// Index for efficient comment retrieval by memory
CommentSchema.index({ memoryId: 1, timestamp: -1 });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
