import { BookOpen, BookX, Users } from 'lucide-react';
import { useBookStore } from '../store/book-store';
import { useAuthStore } from '../store/auth-store';

export function DashboardPage() {
  const { books = [] } = useBookStore(); // Default to empty array if books is undefined
  const { user } = useAuthStore();

  // If no books are loaded, show a loading message
  if (!books.length) {
    return (
      <div className="text-center mt-8">
        <p>Loading books...</p>
      </div>
    );
  }

  const totalBooks = books.length;
  const borrowedBooks = books.filter((book) => !book.availabilityStatus).length;
  const availableBooks = totalBooks - borrowedBooks;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name || 'Guest'}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Books
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {totalBooks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookX className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Borrowed Books
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {borrowedBooks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Books
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {availableBooks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {books.map((book) => (
                <li key={book._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {book.title}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            book.availabilityStatus
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {book.availabilityStatus ? 'Available' : 'Borrowed'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {book.author}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
