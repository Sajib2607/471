import express from "express";
import { 
  addBlog, 
  getAllBlogs, 
  getBlogById, 
  deleteBlogById,
  togglePublish,  
  addcomment,
  getBlogComments,
  generateContent,
  updateBlog,
  approveBlog,
  rejectBlog
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single('image'), auth, addBlog);
blogRouter.put("/:id", upload.single('image'), auth, updateBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);
blogRouter.post('/add-comment', addcomment);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/approve', auth, approveBlog);
blogRouter.post('/reject', auth, rejectBlog);

blogRouter.post('/generate', auth, generateContent);


export default blogRouter;