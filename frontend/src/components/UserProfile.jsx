import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate passwords if changing
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to set a new password');
        setLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio
      };

      if (formData.newPassword && formData.currentPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put(
        'http://localhost:5000/api/user/profile',
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(response.data.user);
      setSuccess('Profile updated successfully');
      setEditing(false);
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full p-2 border rounded bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded h-24"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-semibold mb-3">Change Password</h3>
            <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div></div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError('');
                setSuccess('');
                // Reset form data to current user data
                if (user) {
                  setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                    bio: user.bio || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1">{user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="mt-1">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1">{user.address || 'Not provided'}</p>
            </div>
          </div>

          {user.bio && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bio</h3>
              <p className="mt-1">{user.bio}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
            <div className="mt-1 flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
            <p className="mt-1">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;