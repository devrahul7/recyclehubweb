import { useState } from 'react';
import axios from 'axios';
import { X, Upload } from 'lucide-react';

const EditItemModal = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description,
    category: item.category,
    weight: item.weight,
    estimatedValue: item.estimatedValue || ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Plastic',
    'Paper',
    'Metal',
    'Glass',
    'Electronics',
    'Cardboard',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      if (image) {
        submitData.append('image', image);
      }

      await axios.put(`http://localhost:5000/api/items/${item.id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Item</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter item title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your item"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.01"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter weight in kg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Value ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="estimatedValue"
              value={formData.estimatedValue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter estimated value"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload-edit"
              />
              <label
                htmlFor="image-upload-edit"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {image ? image.name : 'Click to upload new image'}
                </span>
              </label>
            </div>
            {item.image && !image && (
              <p className="text-sm text-gray-500 mt-2">
                Current image: {item.image}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;