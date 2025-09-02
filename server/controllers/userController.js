import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import imagekit from '../configs/imageKIt.js';
import fs from 'fs';

export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET);

        res.json({ success: true, token, message: "User registered successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET);

        res.json({ success: true, token, message: "Login successful" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const updateData = req.body;
        const imageFile = req.file;

        // Handle image upload if provided
        if (imageFile) {
            const fileBuffer = fs.readFileSync(imageFile.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: "/user-profiles"
            });

            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '300' }
                ]
            });

            updateData.profileImage = optimizedImageUrl;
        }

        // Hash password if it's being updated
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true }
        ).select('-password');

        res.json({ success: true, user, message: "Profile updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getUserDrafts = async (req, res) => {
    try {
        const drafts = await Blog.find({ 
            author: req.user.userId,
            isPublished: false 
        }).sort({ createdAt: -1 });
        
        res.json({ success: true, drafts });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getUserApprovedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({
            author: req.user.userId,
            reviewStatus: 'approved',
            isPublished: true
        }).sort({ createdAt: -1 });

        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const submitBlogForReview = async (req, res) => {
    try {
        const { blogId } = req.body;
        
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        // Check if user owns this blog
        if (blog.author.toString() !== req.user.userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        blog.reviewStatus = 'pending';
        blog.isReviewed = true;
        await blog.save();

        res.json({ success: true, message: "Blog submitted for review successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}; 