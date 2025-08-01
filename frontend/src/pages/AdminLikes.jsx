import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminLikes = () => {
  const { user } = useAuth();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLikes, setTotalLikes] = useState(0);
  const [selectedItem, setSelectedItem] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchItems();
      fetchLikes();
    }
  }, [user, currentPage, selectedItem]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/items/all',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = `http://localhost:5000/api/likes/all?page=${currentPage}&limit=20`;
      
      if (selectedItem) {
        url = `http://localhost:5000/api/likes/item/${selectedItem}?page=${currentPage}&limit=20`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLikes(response.data.likes || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalLikes(response.data.totalLikes || 0);
    } catch (error) {
      console.error('Error fetching likes:', error);
      setLikes([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemFilter = (itemId) => {
    setSelectedItem(itemId);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Likes Management</h1>
          <p className="mt-2 text-gray-600">
            {totalLikes} total {totalLikes === 1 ? 'like' : 'likes'}
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="item-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Item
          </label>
          <select
            id="item-filter"
            value={selectedItem}
            onChange={(e) => handleItemFilter(e.target.value)}
            className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Items</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        {likes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No likes found</h3>
            <p className="mt-2 text-gray-500">No likes match the current filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {likes.map((like) => (
                  <li key={like.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {like.item?.image && (
                          <img
                            src={`http://localhost:5000/uploads/${like.item.image}`}
                            alt={like.item.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {like.item?.title || 'Unknown Item'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Liked by: {like.user?.name || 'Unknown User'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {formatDate(like.createdAt)}
                        </p>
                        <div className="flex items-center mt-1">
                          <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          <span className="ml-1 text-sm text-gray-600">Liked</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLikes;