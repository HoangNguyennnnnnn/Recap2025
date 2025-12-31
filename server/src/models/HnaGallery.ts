import mongoose, { Schema, Document } from 'mongoose';

export interface IPhotoEntry {
  publicId: string;
  url: string;
  caption?: string;
  order: number;
}

export interface IHnaGallery extends Document {
  title?: string;
  description?: string;
  photos: IPhotoEntry[];
  tags: string[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoEntrySchema = new Schema<IPhotoEntry>({
  publicId: { type: String, required: true },
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const HnaGallerySchema = new Schema<IHnaGallery>(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    photos: {
      type: [PhotoEntrySchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for chronological queries
HnaGallerySchema.index({ date: -1 });

export const HnaGallery = mongoose.model<IHnaGallery>('HnaGallery', HnaGallerySchema);
