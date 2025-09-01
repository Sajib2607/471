import express from 'express';
import { 
  userRegister, 
  userLogin, 
  getUserProfile, 
  updateUserProfile,
  getUserDrafts,
  submitBlogForReview
} from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', userRegister);
userRouter.post('/login', userLogin);
userRouter.get('/profile', auth, getUserProfile);
userRouter.put('/profile', upload.single('profileImage'), auth, updateUserProfile);
userRouter.get('/drafts', auth, getUserDrafts);
userRouter.post('/submit-review', auth, submitBlogForReview);

export default userRouter; 