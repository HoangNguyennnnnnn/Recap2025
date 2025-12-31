import mongoose, { Schema, Document } from 'mongoose';

export interface ISecretMedia extends Document {
  type: 'photo' | 'video' | 'note';
  title: string;
  content?: string; // For notes or captions
  url?: string; // For photos/videos
  publicId?: string; // For Cloudinary cleanup
  date: Date;
}

const SecretMediaSchema: Schema = new Schema({
  type: { type: String, enum: ['photo', 'video', 'note'], required: true },
  title: { type: String, required: true },
  content: { type: String },
  url: { type: String },
  publicId: { type: String },
  date: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const SecretMedia = mongoose.model<ISecretMedia>('SecretMedia', SecretMediaSchema);
