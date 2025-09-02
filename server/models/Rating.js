import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
  value: { type: Number, min: 1, max: 5, required: true },
}, { timestamps: true });

const Rating = mongoose.model('rating', ratingSchema);

export default Rating;


