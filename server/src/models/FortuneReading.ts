import mongoose, { Schema, Document } from 'mongoose';

export interface IFortuneReadingInput {
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  question?: string;
}

export interface IFortuneReading extends Document {
  profileSlug: string;
  input: IFortuneReadingInput;
  result: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const FortuneReadingSchema = new Schema<IFortuneReading>(
  {
    profileSlug: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    input: {
      type: Schema.Types.Mixed,
      default: {},
    },
    result: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const FortuneReading = mongoose.model<IFortuneReading>(
  'FortuneReading',
  FortuneReadingSchema
);
