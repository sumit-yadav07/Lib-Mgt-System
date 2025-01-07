import asyncHandler from 'express-async-handler';
import { Book } from '../models/book.model.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({});
  res.json(books);
});

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Admin
export const createBook = asyncHandler(async (req, res) => {
  const book = new Book(req.body);
  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Admin
export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    Object.assign(book, req.body);
    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Admin
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// @desc    Borrow a book
// @route   PUT /api/books/borrow/:id
// @access  Private (Authenticated users)
export const borrowBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  const user = await User.findById(req.body.userId);  // Assuming the user ID is sent in the request body

  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (book.isBorrowed) {
    res.status(400).json({ message: 'Book is already borrowed' });
    return;
  }

  book.isBorrowed = true;
  book.borrowedBy = user._id;  // Set the borrowedBy field to the user ID
  book.availabilityStatus = false;  // Mark the book as unavailable
  await book.save();

  res.status(200).json({ message: 'Book borrowed successfully', book });
});

// @desc    Return a book
// @route   PUT /api/books/return/:id
// @access  Private (Only logged-in users can return books)
// @desc    Return a book
// @route   POST /api/transactions/return/:bookId
// @access  Private
export const returnBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Find the transaction related to the user
  const transaction = await Transaction.findOne({
    bookId: book._id,
    userId: req.user._id,
    returnDate: null,  // Only allow return for books that are borrowed and not returned yet
  });

  if (!transaction) {
    return res.status(400).json({ message: 'You have not borrowed this book or it has already been returned' });
  }

  // Set the return date on the transaction
  transaction.returnDate = Date.now();
  await transaction.save();

  // Mark the book as available again
  book.availabilityStatus = true;
  await book.save();

  // Return the updated transaction with populated fields
  const populatedTransaction = await transaction.populate([
    'bookId',
    { path: 'userId', select: '-password' },
  ]);

  res.json(populatedTransaction);
});
