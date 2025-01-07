import asyncHandler from 'express-async-handler';
import { Transaction } from '../models/transaction.model.js';
import { Book } from '../models/book.model.js';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Admin
export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({})
    .populate('bookId')
    .populate('userId', '-password');
  res.json(transactions);
});

// @desc    Get user transactions
// @route   GET /api/transactions/my
// @access  Private
export const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user._id })
    .populate('bookId')
    .populate('userId', '-password');
  res.json(transactions);
});

// @desc    Borrow a book
// @route   POST /api/transactions/borrow/:bookId
// @access  Private
// transaction.controller.js
export const borrowBook = asyncHandler(async (req, res) => {
  console.log('Borrow request received');
  console.log('Book ID:', req.params.bookId);
  console.log('User:', req.user);

  const book = await Book.findById(req.params.bookId);
  if (!book) {
    console.log('Book not found');
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!book.availabilityStatus) {
    console.log('Book not available');
    return res.status(400).json({ message: 'Book is not available' });
  }

  try {
    // Create a new transaction
    const transaction = new Transaction({
      bookId: book._id,
      userId: req.user._id,
      borrowDate: new Date(),
    });

    console.log('Creating transaction:', transaction);
    await transaction.save();
    console.log('Transaction saved successfully');

    // Mark the book as unavailable
    book.availabilityStatus = false;
    await book.save();
    console.log('Book status updated');

    // Populate the transaction with book and user details
    const populatedTransaction = await transaction.populate([
      'bookId',
      { path: 'userId', select: '-password' },
    ]);

    res.status(201).json(populatedTransaction);
  } catch (error) {
    console.error('Error in borrowBook:', error);
    res.status(500).json({ message: 'Failed to create transaction', error: error.message });
  }
});

// @desc    Return a book
// @route   POST /api/transactions/return/:bookId
// @access  Private
// In transaction.controller.js
export const returnBook = asyncHandler(async (req, res) => {
  console.log('Return book request received');
  console.log('Book ID:', req.params.bookId);
  console.log('User ID:', req.user._id);

  const book = await Book.findById(req.params.bookId);
  if (!book) {
    console.log('Book not found');
    return res.status(404).json({ message: 'Book not found' });
  }
  console.log('Book found:', book);

  // Find the transaction and log the query parameters
  const query = {
    bookId: book._id,
    userId: req.user._id,
    returnDate: null,
  };
  console.log('Looking for transaction with:', query);

  const transaction = await Transaction.findOne(query);
  console.log('Found transaction:', transaction);

  if (!transaction) {
    // Let's find ALL transactions for this book to debug
    const allTransactions = await Transaction.find({ bookId: book._id });
    console.log('All transactions for this book:', allTransactions);
    
    return res.status(400).json({ 
      message: 'You have not borrowed this book or it has already been returned' 
    });
  }
  // Set return date
  transaction.returnDate = Date.now();
  await transaction.save();

  // Update book availability
  book.availabilityStatus = true;
  await book.save();

  console.log('Book returned successfully');

  const populatedTransaction = await transaction.populate([
    'bookId',
    { path: 'userId', select: '-password' },
  ]);

  res.json(populatedTransaction);
  // Rest of your code...
});
  
