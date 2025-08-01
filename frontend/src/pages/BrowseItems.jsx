import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';
import Categories from '../components/Categories';
import ItemCard from '../components/ItemCard';
import Likes from '../components/Likes';
import Reviews from '../components/Reviews';

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('approved');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, sortBy, statusFilter, searchTerm]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {
        status: statusFilter,
        category: selectedCategory,
        search: searchTerm,
        sortBy
      };
      
      const response = await axios.get('http://localhost:5000/api/items', { params });
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const ItemModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {item.image && (
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-gray-900">{item.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Category</h3>
                      <p className="text-gray-900">{item.category}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                      <p className="text-gray-900">{item.weight} kg</p>
                    </div>
                    {item.estimatedValue && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Estimated Value</h3>
                        <p className="text-gray-900">${item.estimatedValue}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {item.User && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Submitted by</h3>
                      <p className="text-gray-900">{item.User.name}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Likes itemId={item.id} initialLikesCount={item.likesCount} />
                    <div className="text-sm text-gray-500">
                      {item.reviewsCount || 0} review{(item.reviewsCount || 0) !== 1 ? 's' : ''}
                      {item.averageRating && (
                        <span className="ml-2">
                          ⭐ {parseFloat(item.averageRating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Reviews itemId={item.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
          <p className="text-gray-600">Discover and interact with recycling items from the community</p>
        </div>

        <Categories onSelectCategory={handleCategorySelect} selectedCategoryId={selectedCategory} />

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostLiked">Most Liked</option>
              <option value="highestRated">Highest Rated</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="approved">Approved Only</option>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} onClick={() => handleItemClick(item)} className="cursor-pointer">
                <ItemCard item={item} onUpdate={fetchItems} showUser={true} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showItemModal && (
        <ItemModal
          item={selectedItem}
          onClose={() => {
            setShowItemModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default BrowseItems;