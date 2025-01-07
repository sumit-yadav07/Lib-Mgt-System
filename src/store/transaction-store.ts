import { create } from 'zustand';
import type { Transaction } from '../types';
import { useBookStore } from './book-store';
import axios from 'axios';  // Ensure axios is imported for API requests

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  borrowBook: (bookId: string, userId: string) => Promise<void>;
  returnBook: (bookId: string, userId: string) => Promise<void>;
}

// Mock initial transactions
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    bookId: '1',
    userId: '2',
    borrowDate: '2024-03-01T10:00:00Z',
    book: {
      _id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      publicationYear: 1925,
      availabilityStatus: false,
    },
    user: {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
    },
  },
];

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: MOCK_TRANSACTIONS,
  loading: false,
  error: null,
  borrowBook: async (bookId: string, userId: string) => {
    set({ loading: true });
    try {
      const book = useBookStore.getState().books.find((b) => b._id === bookId);
      if (!book) throw new Error('Book not found');
      if (!book.availabilityStatus) throw new Error('Book is not available');

      // Update book availability status
      await useBookStore.getState().updateBook(bookId, { availabilityStatus: false });

      // Create transaction entry
      const newTransaction: Transaction = {
        id: Math.random().toString(),
        bookId,
        userId,
        borrowDate: new Date().toISOString(),
        book,
        user: {
          id: userId,
          email: 'user@example.com', // Replace with actual user email
          name: 'Regular User', // Replace with actual user name
          role: 'user', // Adjust the role accordingly
        },
      };

      // Update transactions state
      set((state) => ({
        transactions: [...state.transactions, newTransaction],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to borrow book', loading: false });
      console.error(error);
    }
  },
  returnBook: async (bookId: string, userId: string) => {
    set({ loading: true });
    try {
      // Get the auth token - adjust this based on how you store your token
      const token = localStorage.getItem('token'); // or however you store your token
  
      const response = await axios.post(
        `http://localhost:5000/api/transactions/return/${bookId}`,
        {}, // empty body since we're using URL params
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add auth header
          },
        }
      );
  
      if (response.data) {
        // Update book availability status
        await useBookStore.getState().updateBook(bookId, { availabilityStatus: true });
  
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.bookId === bookId && t.userId === userId && !t.returnDate
              ? { ...t, returnDate: new Date().toISOString() }
              : t
          ),
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Return book error:', error.response || error);
      set({ error: 'Failed to return book', loading: false });
      throw error;
    }
  },
}));
