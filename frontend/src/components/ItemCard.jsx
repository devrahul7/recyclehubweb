import { useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import EditItemModal from './EditItemModal';
import Likes from './Likes';
import Reviews from './Reviews';

const ItemCard = ({ item, onUpdate, showUser = false }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/items/${item.id}`);
      onUpdate();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    onUpdate();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {item.image && (
          <img
            src={`http://localhost:5000/uploads/${item.image}`}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
            <div className="flex items-center">
              {getStatusIcon(item.status)}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium">{item.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Weight:</span>
              <span className="font-medium">{item.weight} kg</span>
            </div>
            {item.estimatedValue && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Value:</span>
                <span className="font-medium">${item.estimatedValue}</span>
              </div>
            )}
            {showUser && item.User && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">User:</span>
                <span className="font-medium">{item.User.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-md"
                title="View reviews"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                title="Edit item"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                title="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
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
          
          {item.adminNotes && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Admin Notes:</span> {item.adminNotes}
              </p>
            </div>
          )}
          
          {showReviews && (
            <div className="mt-4 border-t pt-4">
              <Reviews itemId={item.id} />
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <EditItemModal
          item={item}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default ItemCard;