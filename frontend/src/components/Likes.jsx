import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Likes = ({ itemId, initialLikesCount = 0, showCount = true }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && itemId) {
      checkUserLike();
    }
  }, [user, itemId]);

  const checkUserLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/likes/check/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      alert('Please login to like items');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/likes/${itemId}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleLike}
        disabled={loading}
        className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
          isLiked
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <svg
          className={`w-4 h-4 ${isLiked ? 'fill-current' : 'stroke-current fill-none'}`}
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {showCount && <span className="text-sm">{likesCount}</span>}
      </button>
    </div>
  );
};

export default Likes;