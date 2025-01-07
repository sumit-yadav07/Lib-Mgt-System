import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Library, LogOut, Settings, Users } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';
import { cn } from '../lib/utils';

export function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // Redirect to login if the user is not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Define navigation items dynamically based on the user's role
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Library },
    { name: 'Books', href: '/books', icon: BookOpen },
    { name: 'Borrow/Return', href: '/transactions', icon: Settings },
    ...(user.role === 'admin'
      ? [{ name: 'Users', href: '/users', icon: Users }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
              {/* Sidebar Header */}
              <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    Library MS
                  </span>
                </div>

                {/* Navigation Links */}
                <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
                          isActive
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'mr-3 h-6 w-6 flex-shrink-0',
                            isActive
                              ? 'text-indigo-600'
                              : 'text-gray-400 group-hover:text-gray-500'
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer */}
              <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                <div className="flex items-center w-full">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {user.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500">
                      {user.role}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      window.location.reload(); // Ensure logout redirects to login
                    }}
                    className="ml-auto flex items-center justify-center rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
