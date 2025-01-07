import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/book.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, admin, createBook);

router.route('/:id')
  .get(getBookById)
  .put(protect, updateBook)
  .delete(protect, admin, deleteBook);

export default router;