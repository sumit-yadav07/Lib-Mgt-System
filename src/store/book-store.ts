import { create } from 'zustand';
import type { Book } from '../types';

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
}

export const useBookStore = create<BookState>()((set) => ({
  books: [],
  loading: false,
  error: null,

  // Fetch books from backend
  fetchBooks: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch books');
      }

      const data = await response.json();
      set({ books: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch books', loading: false });
      console.error('Fetch error:', error);
    }
  },

  // Add book to backend
  addBook: async (book) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to add book');
      }

      const newBook = await response.json();
      set((state) => ({
        books: [...state.books, newBook],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add book', loading: false });
      console.error('Add book error:', error);
    }
  },

  // Update book in backend
  updateBook: async (id, bookUpdate) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(bookUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to update book');
      }

      const updatedBook = await response.json();
      set((state) => ({
        books: state.books.map((book) =>
          book._id === id ? updatedBook : book
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update book', loading: false });
      console.error('Update book error:', error);
    }
  },

  // Delete book from backend
  deleteBook: async (id) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to delete book');
      }

      set((state) => ({
        books: state.books.filter((book) => book._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete book', loading: false });
      console.error('Delete book error:', error);
    }
  },
}));
