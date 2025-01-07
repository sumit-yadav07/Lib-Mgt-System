import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useBookStore } from '../store/book-store';
import { useAuthStore } from '../store/auth-store';
import toast from 'react-hot-toast';
import type { Book } from '../types';

export function BooksPage() {
  const { books, loading, error, fetchBooks, addBook, updateBook, deleteBook } = useBookStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'borrowed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publicationYear: new Date().getFullYear(),
    coverImage: '',
  });

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'available' && book.availabilityStatus) ||
      (filterStatus === 'borrowed' && !book.availabilityStatus);
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await updateBook(editingBook._id, { ...formData, availabilityStatus: editingBook.availabilityStatus });
        toast.success('Book updated successfully');
      } else {
        await addBook({ ...formData, availabilityStatus: true });
        toast.success('Book added successfully');
      }
      setIsModalOpen(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', publicationYear: new Date().getFullYear(), coverImage: '' });
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (book: Book) => {
    console.log('Editing book with id:', book._id);  // Check if book has a valid id
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publicationYear: book.publicationYear,
      coverImage: book.coverImage || '',
    });
    setIsModalOpen(true);
  };
  
  
  const handleDelete = async (id: string) => {
    console.log('Attempting to delete book with id:', id);  // Check the value of id here
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);  // Make sure `id` is passed correctly
        toast.success('Book deleted successfully');
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };
  
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Books</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'available' | 'borrowed')}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="all">All Books</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div> // Display error message
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <div key={book._id} className="bg-white rounded-lg shadow overflow-hidden">
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="text-sm text-gray-500">Published: {book.publicationYear}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      book.availabilityStatus
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.availabilityStatus ? 'Available' : 'Borrowed'}
                  </span>
                  {user?.role === 'admin' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Publication Year</label>
                <input
                  type="number"
                  required
                  min="1800"
                  max={new Date().getFullYear()}
                  value={formData.publicationYear}
                  onChange={(e) => setFormData({ ...formData, publicationYear: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  {editingBook ? 'Save Changes' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
