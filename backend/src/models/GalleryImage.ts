import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A gallery image must have a title'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      required: [true, 'A gallery image must have a URL']
    },
    category: {
      type: String,
      default: 'general'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

export default GalleryImage;