import mongoose, { Schema, Document } from 'mongoose';

export interface IVoiceNote extends Document {
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  audioUrl: string;
  transcript?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VoiceNoteSchema = new Schema<IVoiceNote>(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    audioUrl: {
      type: String,
      required: true,
    },
    transcript: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for date-based queries
VoiceNoteSchema.index({ date: -1 });

// Geospatial index for location-based queries (optional enhancement)
VoiceNoteSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

export const VoiceNote = mongoose.model<IVoiceNote>('VoiceNote', VoiceNoteSchema);
