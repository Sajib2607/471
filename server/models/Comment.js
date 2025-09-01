
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    isApproved: { type: Boolean, default: false }
},{timestamps: true});

const comment = mongoose.model('Comment', commentSchema);

export default comment;
