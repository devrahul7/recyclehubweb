import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Package, Clock, CheckCircle, XCircle, Plus, Heart, Star, Wallet, User } from 'lucide-react';
import AddItemModal from '../components/AddItemModal';
import ItemCard from '../components/ItemCard';
import Transactions from '../components/Transactions';
import UserProfile from '../components/UserProfile';
import Notifications from '../components/Notifications';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    pendingItems: 0,
    approvedItems: 0,
    rejectedItems: 0,
    totalLikes: 0,
    totalReviews: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/dashboard');
      setStats(response.data.stats);
      setRecentItems(response.data.recentItems);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = () => {
    fetchDashboardData();
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Manage your recycle items and track your progress</p>
          </div>
          <div className="flex items-center space-x-2">
            <Notifications />
          </div>
        </div>
        
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-md font-medium ${activeTab === 'dashboard' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`px-4 py-2 rounded-md font-medium ${activeTab === 'wallet' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              My Wallet
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md font-medium ${activeTab === 'profile' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Profile
            </button>
          </nav>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingItems}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.approvedItems}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.rejectedItems}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-pink-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Likes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLikes || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalReviews || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Items</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>
              <div className="p-6">
                {recentItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No items yet. Add your first recycle item!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentItems.map((item) => (
                      <ItemCard key={item.id} item={item} onUpdate={fetchDashboardData} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'wallet' && <Transactions />}
        
        {activeTab === 'profile' && <UserProfile />}
      </div>

      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onItemAdded={handleItemAdded}
        />
      )}
    </div>
  );
};

export default UserDashboard;