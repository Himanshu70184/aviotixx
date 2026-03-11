import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, default: '' },
    image: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    message: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
