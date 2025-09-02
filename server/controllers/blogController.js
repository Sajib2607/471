import fs from 'fs';
import imagekit from '../configs/imageKIt.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js'; // <-- Added import
import Advert from '../models/Advert.js';
import Rating from '../models/Rating.js';
import mongoose from 'mongoose';
import main from '../configs/gemini.js';


export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished, aiTone, writingStyle } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    // Check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    });

    // Optimization through ImageKit URL transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: 'auto' }, // Auto compression
        { format: 'webp' },  // Convert to modern format
        { width: '1280' }    // Width resizing
      ]
    });

    const image = optimizedImageUrl;

    // Check if user is admin or regular user
    const isAdmin = req.user.email === process.env.ADMIN_EMAIL;
    
    await Blog.create({ 
      title, 
      subTitle, 
      description, 
      category, 
      image, 
      isPublished: isAdmin ? isPublished : false, // Only admins can publish directly
      aiTone: aiTone || 'informative',
      writingStyle: writingStyle || 'article',
      author: isAdmin ? null : req.user.userId, // Admin blogs don't need author field
      reviewStatus: isAdmin ? 'approved' : 'pending'
    });
    
    const message = isAdmin ? "Blog added successfully" : "Blog saved as draft. Submit for review when ready.";
    res.json({ success: true, message });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    // Check if user is admin or owns the blog
    const isAdmin = req.user.email === process.env.ADMIN_EMAIL;
    if (!isAdmin && blog.author && blog.author.toString() !== req.user.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Blog.findByIdAndDelete(id);
    // Delete associated comments
    await Comment.deleteMany({ blog: id }); // Delete associated comments

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const approveBlog = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    blog.reviewStatus = 'approved';
    blog.isPublished = true;
    await blog.save();
    res.json({ success: true, message: "Blog approved and published" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const rejectBlog = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    blog.reviewStatus = 'rejected';
    await blog.save();
    res.json({ success: true, message: "Blog rejected" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addcomment = async (req, res) => {
  try {
    const { blog, name, comment } = req.body;
    await Comment.create({ blog, name, content: comment });
    res.json({ success: true, message: 'Comment added for review' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt, tone = 'informative', style = 'article' } = req.body;
    
    // Create a more detailed prompt based on tone and style
    const toneDescriptions = {
      'formal': 'in a formal and professional tone',
      'casual': 'in a casual and relaxed tone',
      'informative': 'in an informative and educational tone',
      'academic': 'in an academic and scholarly tone',
      'friendly': 'in a friendly and approachable tone',
      'professional': 'in a professional and business-like tone',
      'conversational': 'in a conversational and engaging tone',
      'technical': 'in a technical and detailed tone'
    };

    const styleDescriptions = {
      'article': 'as a comprehensive article',
      'blog-post': 'as an engaging blog post',
      'tutorial': 'as a step-by-step tutorial',
      'review': 'as a detailed review',
      'news': 'as a news article',
      'story': 'as a narrative story',
      'guide': 'as a helpful guide',
      'analysis': 'as an analytical piece'
    };

    const toneDesc = toneDescriptions[tone] || toneDescriptions['informative'];
    const styleDesc = styleDescriptions[style] || styleDescriptions['article'];
    
    const enhancedPrompt = `Generate a blog content about "${prompt}" ${styleDesc} ${toneDesc}. Make it engaging, well-structured, and include relevant information.`;
    
    const content = await main(enhancedPrompt);
    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subTitle, description, category, isPublished, aiTone, writingStyle } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    // Check if blog exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    // Check if user is admin or owns the blog
    const isAdmin = req.user.email === process.env.ADMIN_EMAIL;
    if (!isAdmin && existingBlog.author && existingBlog.author.toString() !== req.user.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Update blog data
    const updateData = {
      title,
      subTitle,
      description,
      category,
      isPublished: isAdmin ? isPublished : false, // Only admins can publish directly
      aiTone: aiTone || existingBlog.aiTone,
      writingStyle: writingStyle || existingBlog.writingStyle
    };

    // Handle image update if new image is provided
    if (imageFile) {
      const fileBuffer = fs.readFileSync(imageFile.path);

      // Upload new image to ImageKit
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: imageFile.originalname,
        folder: "/blogs"
      });

      // Optimization through ImageKit URL transformation
      const optimizedImageUrl = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '1280' }
        ]
      });

      updateData.image = optimizedImageUrl;
    }

    await Blog.findByIdAndUpdate(id, updateData);
    const message = isAdmin ? "Blog updated successfully" : "Blog updated. Submit for review when ready.";
    res.json({ success: true, message });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getLatestAdvert = async (req, res) => {
  try {
    const advert = await Advert.findOne({}).sort({ createdAt: -1 });
    res.json({ success: true, advert });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addRating = async (req, res) => {
  try {
    const { blogId, value } = req.body;
    if (!blogId || !value) return res.json({ success: false, message: 'Missing fields' });
    if (value < 1 || value > 5) return res.json({ success: false, message: 'Invalid rating' });
    await Rating.create({ blog: blogId, value });
    const avgAgg = await Rating.aggregate([
      { $match: { blog: new mongoose.Types.ObjectId(blogId) } },
      { $group: { _id: '$blog', avg: { $avg: '$value' }, count: { $sum: 1 } } }
    ]);
    const avg = avgAgg[0]?.avg || 0;
    const count = avgAgg[0]?.count || 0;
    res.json({ success: true, message: 'Thanks for rating', average: avg, count });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getRating = async (req, res) => {
  try {
    const { blogId } = req.params;
    const avgAgg = await Rating.aggregate([
      { $match: { blog: new mongoose.Types.ObjectId(blogId) } },
      { $group: { _id: '$blog', avg: { $avg: '$value' }, count: { $sum: 1 } } }
    ]);
    const avg = avgAgg[0]?.avg || 0;
    const count = avgAgg[0]?.count || 0;
    res.json({ success: true, average: avg, count });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};