import mongoose, { Schema, Document } from 'mongoose';

export type ReactionTargetType = 'memory' | 'video' | 'photo';
export type ReactionType = 'like' | 'love' | 'heart';

export interface IReaction extends Document {
  targetType: ReactionTargetType;
  targetId: string;
  type: ReactionType;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReactionSchema = new Schema<IReaction>(
  {
    targetType: {
      type: String,
      enum: ['memory', 'video', 'photo'],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'love', 'heart'],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient reaction queries
ReactionSchema.index({ targetType: 1, targetId: 1 });
ReactionSchema.index({ userId: 1 });

export const Reaction = mongoose.model<IReaction>('Reaction', ReactionSchema);
