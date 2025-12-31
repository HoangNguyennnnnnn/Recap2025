import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  sessionToken: string;
  lastVisit: Date;
  preferences: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lastVisit: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
