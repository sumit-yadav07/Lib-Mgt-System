import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: true,
    },
    availabilityStatus: {
      type: Boolean,
      default: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    isBorrowed: {
      type: Boolean,
      default: false, // Initially, books are not borrowed
    },
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      default: null, // Initially, no user has borrowed the book
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model('Book', bookSchema);
