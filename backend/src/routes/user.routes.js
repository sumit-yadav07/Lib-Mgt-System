import express from 'express';
import {
  loginUser,
  registerUser,
  getUsers,
  getUserProfile,
} from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

export default router;