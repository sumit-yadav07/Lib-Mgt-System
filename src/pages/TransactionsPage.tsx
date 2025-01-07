import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ArrowLeftRight } from 'lucide-react';
import { useBookStore } from '../store/book-store';
import { useAuthStore } from '../store/auth-store';
import { useTransactionStore } from '../store/transaction-store';
import toast from 'react-hot-toast';
import { formatDate } from '../lib/utils';

export function TransactionsPage() {
  const { books } = useBookStore();
  const { user } = useAuthStore();
  const { transactions, borrowBook, returnBook } = useTransactionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableBooks = books.filter((book) => book.availabilityStatus);
  const borrowedBooks = books.filter((book) => !book.availabilityStatus);

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBorrow = async () => {
    if (!selectedBook) {
      toast.error('Please select a book');
      return;
    }

    try {
      setIsLoading(true);
      await borrowBook(selectedBook, user!.id);
      toast.success('Book borrowed successfully');
      setSelectedBook('');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to borrow book');
    }
  };

  const handleReturn = async (bookId: string) => {
    try {
      await returnBook(bookId, user!.id);
      toast.success('Book returned successfully');
    } catch (error) {
      toast.error('Failed to return book');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Borrow / Return Books</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your book transactions here
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Borrow a Book</h2>
        <div className="flex gap-4">
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a book</option>
            {availableBooks.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
          <button
            onClick={handleBorrow}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {isLoading ? 'Loading...' : 'Borrow'}
          </button>
        </div>
      </div>

      {borrowedBooks.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Return a Book</h2>
          <div className="space-y-4">
            {borrowedBooks.map((book) => (
              <div key={book._id} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
                <button
                  onClick={() => handleReturn(book._id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Return
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h2>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrow Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.book.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.book.author}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.borrowDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.returnDate ? formatDate(transaction.returnDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.returnDate
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {transaction.returnDate ? 'Returned' : 'Borrowed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
