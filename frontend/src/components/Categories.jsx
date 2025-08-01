import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = ({ onSelectCategory, selectedCategoryId = null }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading categories...</div>;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategoryId === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategoryId === category.id
                ? `bg-${category.color || 'blue'}-500 text-white`
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor:
                selectedCategoryId === category.id
                  ? category.color || '#3B82F6'
                  : '',
              color: selectedCategoryId === category.id ? '#FFFFFF' : ''
            }}
          >
            {category.icon && (
              <span className="mr-1">{category.icon}</span>
            )}
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;