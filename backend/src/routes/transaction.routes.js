import express from 'express';
import {
  getTransactions,
  getUserTransactions,
  borrowBook,
  returnBook,  // Add returnBook here
} from '../controllers/transaction.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getTransactions);

router.route('/my')
  .get(getUserTransactions);

router.route('/borrow/:bookId')
  .post(borrowBook);

// Add route for returning a book
router.route('/return/:bookId')
  .post(protect, returnBook);  // Handle returning a book here

export default router;
