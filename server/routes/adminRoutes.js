import express from 'express';
import { 
  adminLogin, 
  approveCommentById, 
  getAllComments, 
  getAllBlogsAdmin, 
  getDashboard,
  sendSubscriptionEmail,
  getDrafts,
  getPendingReviews,
  getAllUsers
} from '../controllers/adminController.js';
import { deleteBlogById, approveBlog, rejectBlog } from '../controllers/blogController.js';
import auth from '../middleware/auth.js';

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.get("/drafts", auth, getDrafts);
adminRouter.get("/pending-reviews", auth, getPendingReviews);
adminRouter.get("/users", auth, getAllUsers);
adminRouter.post("/delete-comment", auth, deleteBlogById);
adminRouter.post("/approve-comment", auth, approveCommentById);
adminRouter.post("/approve-blog", auth, approveBlog);
adminRouter.post("/reject-blog", auth, rejectBlog);
adminRouter.get("/dashboard", auth, getDashboard);
adminRouter.post('/notification',sendSubscriptionEmail );


export default adminRouter;

