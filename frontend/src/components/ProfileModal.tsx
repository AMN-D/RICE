import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profileService';
import type { ProfileData } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, refreshUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ProfileData>({
    username: '',
    bio: '',
    github_url: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        github_url: user.github_url || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await profileService.updateProfile(formData);
      await refreshUser();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await profileService.deleteProfile();
      await logout();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Profile' : 'My Profile'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {isEditing ? (
            // Edit Form
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // View Mode
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username || 'User'}
                    className="w-24 h-24 rounded-full border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-gray-600 font-semibold">
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900 font-medium">{user.username}</p>
                </div>

                {user.bio && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Bio</label>
                    <p className="text-gray-900">{user.bio}</p>
                  </div>
                )}

                  {user.github_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">GitHub</label>
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {user.github_url}
                    </a>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-gray-900">#{user.id}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = '/manage';
                  }}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Manage My Rices
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}