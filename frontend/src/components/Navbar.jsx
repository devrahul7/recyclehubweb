import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, LogOut, User, Settings, Search, Heart, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Recycle className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">RecycleHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
            </div>

            <Link
              to="/browse"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span>Browse Items</span>
            </Link>

            {user.role === 'user' && (
              <Link
                to="/my-items"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Items
              </Link>
            )}

            {user.role === 'user' && (
              <Link
                to="/my-likes"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <Heart className="h-4 w-4" />
                <span>My Likes</span>
              </Link>
            )}

            {user.role === 'user' && (
              <Link
                to="/my-reviews"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span>My Reviews</span>
              </Link>
            )}

            {user.role === 'admin' && (
              <Link
                to="/admin/likes"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <Heart className="h-4 w-4" />
                <span>All Likes</span>
              </Link>
            )}

            {user.role === 'admin' && (
              <Link
                to="/admin/reviews"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span>All Reviews</span>
              </Link>
            )}

            {user.role === 'user' && (
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Settings className="h-4 w-4" />
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;