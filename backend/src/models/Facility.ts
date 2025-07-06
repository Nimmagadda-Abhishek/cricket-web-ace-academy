import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A facility must have a name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'A facility must have a description'],
      trim: true
    },
    image_url: {
      type: String,
      required: [true, 'A facility must have an image']
    },
    features: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'upcoming'],
      default: 'available'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Facility = mongoose.model('Facility', facilitySchema);

export default Facility;