import mongoose, { Schema, Document } from 'mongoose';

export interface ILetter extends Document {
  content: string;
  unlockDate: Date;
  isOpened: boolean;
  sender: 'nthz' | 'hna';
  createdAt: Date;
  updatedAt: Date;
}

const LetterSchema = new Schema<ILetter>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    unlockDate: {
      type: Date,
      required: true,
      index: true,
    },
    isOpened: {
      type: Boolean,
      default: false,
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

// Index for querying letters by unlock date
LetterSchema.index({ unlockDate: 1, isOpened: 1 });

export const Letter = mongoose.model<ILetter>('Letter', LetterSchema);
