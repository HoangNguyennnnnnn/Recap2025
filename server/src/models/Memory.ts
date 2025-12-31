import mongoose, { Schema, Document } from 'mongoose';

export interface IMemory extends Document {
  title: string;
  description?: string;
  date: Date;
  photos: string[];
  story?: string;
  tags: string[];
  location?: string;
  sender: 'nthz' | 'hna';
  createdAt: Date;
  updatedAt: Date;
}

const MemorySchema = new Schema<IMemory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    story: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    sender: {
      type: String,
      enum: ['nthz', 'hna'],
      default: 'nthz',
    },
  },
  {
    timestamps: true,
  }
);

// Index for chronological queries
MemorySchema.index({ date: -1 });

export const Memory = mongoose.model<IMemory>('Memory', MemorySchema);
