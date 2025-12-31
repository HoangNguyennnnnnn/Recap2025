import mongoose, { Schema, Document } from 'mongoose';

export interface IPhotoMetadata extends Document {
  publicId: string;
  caption: string;
  album: string;
  batchId?: string; // For grouping photos uploaded together
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoMetadataSchema = new Schema<IPhotoMetadata>(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    album: {
      type: String,
      required: true,
      index: true,
    },
    batchId: {
      type: String,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for album sorting
PhotoMetadataSchema.index({ album: 1, order: 1, createdAt: -1 });

export const PhotoMetadata = mongoose.model<IPhotoMetadata>('PhotoMetadata', PhotoMetadataSchema);
