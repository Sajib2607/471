import jwt from 'jsonwebtoken';
import fs from 'fs';
import imagekit from '../configs/imageKIt.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Advert from '../models/Advert.js';
import nodemailer from 'nodemailer'; 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tripadvisorcse471@gmail.com',  // Use your Gmail address
    pass: 'wkgs oddi wsyi ilwz',     // Use the app password generated earlier
  },
});

export const sendSubscriptionEmail = (req, res) => {
  const { email } = req.body;  // Extract email from request body
  const mailOptions = {
    from: 'tripadvisorcse471@gmail.com',  // Match the transporter's Gmail address
    to: email,  // Use the email from the request body
    subject: 'Thanks for Subscribing!',  // Subject of the email
    text: 'Thank you for subscribing to our blog! We will send you the latest updates.',
    html: '<p>Thank you for subscribing to our blog! We will send you the latest updates.</p>',
  };

  // Sending the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);  // Log error if email fails
      return res.json({ success: false, message: 'Error sending email' });
    } else {
      console.log('Email sent:', info.response);  // Log success if email sent
      return res.json({ success: true, message: 'Email sent successfully' });
    }
  });
};

export const adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate('author', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Pending reviews removed per new requirements

export const getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find({}).populate('author', 'name').sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({ isPublished: false });
        const totalUsers = await User.countDocuments();

        res.json({
            success: true,
            data: {
                blogs,
                comments,
                drafts,
                totalUsers,
                recentBlogs
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const approveCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndUpdate(id, { isApproved: true });
        res.json({ success: true, message: "Comment approved successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    } 
};         

export const getDrafts = async (req, res) => {
    try {
        const drafts = await Blog.find({ isPublished: false }).populate('author', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, drafts });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};         

export const createAdvert = async (req, res) => {
    try {
        const { heading } = req.body;
        const imageFile = req.file;
        if (!heading || !imageFile) {
            return res.json({ success: false, message: 'Heading and image are required' });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/adverts'
        });

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' }
            ]
        });

        const advert = await Advert.create({ heading, image: optimizedImageUrl });
        res.json({ success: true, advert, message: 'Advertisement created successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const listAdverts = async (req, res) => {
    try {
        const adverts = await Advert.find({}).sort({ createdAt: -1 });
        res.json({ success: true, adverts });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateAdvert = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading } = req.body;
        const imageFile = req.file;

        const updateData = {};
        if (heading) updateData.heading = heading;

        if (imageFile) {
            const fileBuffer = fs.readFileSync(imageFile.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: '/adverts'
            });
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

        const advert = await Advert.findByIdAndUpdate(id, updateData, { new: true });
        if (!advert) return res.json({ success: false, message: 'Advertisement not found' });
        res.json({ success: true, advert, message: 'Advertisement updated successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteAdvert = async (req, res) => {
    try {
        const { id } = req.params;
        const advert = await Advert.findByIdAndDelete(id);
        if (!advert) return res.json({ success: false, message: 'Advertisement not found' });
        res.json({ success: true, message: 'Advertisement deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
