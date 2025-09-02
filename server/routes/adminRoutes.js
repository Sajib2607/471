import express from 'express';
import { 
  adminLogin, 
  approveCommentById, 
  getAllComments, 
  getAllBlogsAdmin, 
  getDashboard,
  sendSubscriptionEmail,
  getDrafts,
  getAllUsers,
  createAdvert
} from '../controllers/adminController.js';
import { deleteBlogById, approveBlog, rejectBlog } from '../controllers/blogController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { listAdverts, updateAdvert, deleteAdvert } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.get("/drafts", auth, getDrafts);
// adminRouter.get("/pending-reviews", auth, getPendingReviews);
adminRouter.get("/users", auth, getAllUsers);
adminRouter.post("/delete-comment", auth, deleteBlogById);
adminRouter.post("/approve-comment", auth, approveCommentById);
adminRouter.post("/approve-blog", auth, approveBlog);
adminRouter.post("/reject-blog", auth, rejectBlog);
adminRouter.get("/dashboard", auth, getDashboard);
adminRouter.post('/notification',sendSubscriptionEmail );
adminRouter.post('/advert', upload.single('image'), auth, createAdvert);
adminRouter.get('/advert', auth, listAdverts);
adminRouter.put('/advert/:id', upload.single('image'), auth, updateAdvert);
adminRouter.delete('/advert/:id', auth, deleteAdvert);


export default adminRouter;

