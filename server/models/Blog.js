
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subTitle: {type: String},
    description: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},
    isPublished: {type: Boolean, required: true},
    aiTone: {type: String, default: 'informative'},
    writingStyle: {type: String, default: 'article'},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    isReviewed: {type: Boolean, default: false},
    reviewStatus: {type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending'},

},{timestamps: true});

const Blog = mongoose.model('blog', blogSchema);

export default Blog;
