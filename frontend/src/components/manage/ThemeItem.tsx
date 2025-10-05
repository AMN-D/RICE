import { useState } from 'react';
import { themeService } from '../../services/themeService';
import { mediaService } from '../../services/mediaService';
import type { Media } from '../../types';
import MediaItem from './MediaItem';

interface ThemeItemProps {
  theme: any;
  onUpdate: () => void;
  onError: (error: string) => void;
}

export default function ThemeItem({ theme, onUpdate, onError }: ThemeItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: theme.name,
    description: theme.description || '',
    tags: theme.tags || '',
  });
  const [showMedia, setShowMedia] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: theme.name,
      description: theme.description || '',
      tags: theme.tags || '',
    });
  };

  const handleUpdate = async () => {
    try {
      await themeService.updateTheme(theme.id, editForm);
      setIsEditing(false);
      onUpdate();
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to update theme');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this theme?')) return;

    try {
      await themeService.deleteTheme(theme.id);
      onUpdate();
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to delete theme');
    }
  };

  const toggleMedia = async () => {
    if (showMedia) {
      setShowMedia(false);
      setMedia([]);
    } else {
      setShowMedia(true);
      await loadMedia();
    }
  };

  const loadMedia = async () => {
    try {
      setLoadingMedia(true);
      const data = await mediaService.getThemeMedia(theme.id);
      setMedia(data.sort((a, b) => a.display_order - b.display_order));
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to load media');
    } finally {
      setLoadingMedia(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      {isEditing ? (
        // Edit Theme Mode
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Theme Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View Theme Mode
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{theme.name}</h4>
              {theme.description && (
                <p className="text-sm text-gray-600 mt-1">{theme.description}</p>
              )}
              {theme.tags && (
                <p className="text-xs text-gray-500 mt-1">Tags: {theme.tags}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700"
            >
              Edit
            </button>
            <button
              onClick={toggleMedia}
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
            >
              {showMedia ? 'Hide Media' : 'Manage Media'}
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>

          {/* Media Section */}
          {showMedia && (
            loadingMedia ? (
              <div className="mt-4 text-center text-sm text-gray-500">Loading media...</div>
            ) : (
              <MediaItem
                media={media}
                themeId={theme.id}
                onUpdate={loadMedia}
                onError={onError}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}