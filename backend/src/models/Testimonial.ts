import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A testimonial must have a name'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'A testimonial must have a role'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'A testimonial must have content'],
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    image_url: {
      type: String,
      required: [true, 'A testimonial must have an image']
    },
    is_featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;