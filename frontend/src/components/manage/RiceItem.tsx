import { useState } from 'react';
import { riceService } from '../../services/riceService';
import { themeService } from '../../services/themeService';
import type { Rice } from '../../types';
import ThemeItem from './ThemeItem';

interface RiceItemProps {
  rice: Rice;
  onUpdate: () => void;
  onError: (error: string) => void;
}

export default function RiceItem({ rice, onUpdate, onError }: RiceItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: rice.name,
    dotfile_url: rice.dotfile_url
  });
  const [showThemes, setShowThemes] = useState(false);
  const [themes, setThemes] = useState<any[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: rice.name,
      dotfile_url: rice.dotfile_url
    });
  };

  const handleUpdate = async () => {
    try {
      await riceService.updateRice(rice.id, editForm);
      setIsEditing(false);
      onUpdate();
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to update rice');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this rice?')) return;

    try {
      await riceService.deleteRice(rice.id, true);
      onUpdate();
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to delete rice');
    }
  };

  const toggleThemes = async () => {
    if (showThemes) {
      setShowThemes(false);
      setThemes([]);
    } else {
      setShowThemes(true);
      await loadThemes();
    }
  };

  const loadThemes = async () => {
    try {
      setLoadingThemes(true);
      const data = await themeService.getThemesByRice(rice.id);
      setThemes(data);
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to load themes');
    } finally {
      setLoadingThemes(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        {isEditing ? (
          // Edit Rice Mode
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rice Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dotfile URL
              </label>
              <input
                type="url"
                value={editForm.dotfile_url}
                onChange={(e) => setEditForm({ ...editForm, dotfile_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View Rice Mode
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {rice.name}
                </h2>
                <a
                  href={rice.dotfile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {rice.dotfile_url}
                </a>
              </div>

              {rice.preview_image && (
                <img
                  src={rice.preview_image}
                  alt={rice.name}
                  className="w-32 h-20 object-cover rounded-lg ml-4"
                />
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              <span>{rice.views} views</span>
              <span>{rice.themes_count} themes</span>
              <span>{rice.reviews_count} reviews</span>
              {rice.avg_rating && <span>★ {rice.avg_rating.toFixed(1)}</span>}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Edit Rice
              </button>
              <button
                onClick={toggleThemes}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                {showThemes ? 'Hide Themes' : 'Manage Themes'}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Delete Rice
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Themes Section */}
      {showThemes && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Themes</h3>
          
          {loadingThemes ? (
            <div className="text-center text-gray-500 py-4">Loading themes...</div>
          ) : themes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No themes yet</p>
          ) : (
            <div className="space-y-3">
              {themes.map((theme) => (
                <ThemeItem
                  key={theme.id}
                  theme={theme}
                  onUpdate={loadThemes}
                  onError={onError}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}