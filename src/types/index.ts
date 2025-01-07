export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  publicationYear: number;
  availabilityStatus: boolean;
  coverImage?: string;
}

export interface Transaction {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  returnDate?: string;
  book: Book;
  user: User;
}