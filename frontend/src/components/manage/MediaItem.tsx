import { useState } from 'react';
import type { Media } from '../../types';

interface MediaItemProps {
  media: Media[];
  themeId: number;
  onUpdate: () => void;
  onError: (error: string) => void;
}

export default function MediaItem({ media, themeId, onUpdate, onError }: MediaItemProps) {
  const [addingMedia, setAddingMedia] = useState(false);
  const [newMediaForm, setNewMediaForm] = useState({
    url: '',
    media_type: 'IMAGE' as 'IMAGE' | 'VIDEO',
    display_order: 0,
    thumbnail_url: ''
  });
  const [editingMediaId, setEditingMediaId] = useState<number | null>(null);
  const [editMediaForm, setEditMediaForm] = useState({
    url: '',
    display_order: 0,
    thumbnail_url: ''
  });

  const handleAddMedia = async () => {
    try {
      const { mediaService } = await import('../../services/mediaService');
      await mediaService.addMedia(themeId, newMediaForm);
      setAddingMedia(false);
      setNewMediaForm({
        url: '',
        media_type: 'IMAGE',
        display_order: media.length,
        thumbnail_url: ''
      });
      onUpdate();
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to add media');
    }
  };

  const handleEditMedia = (mediaItem: Media) => {
    setEditingMediaId(mediaItem.id);
    setEditMediaForm({
      url: mediaItem.url,
      display_order: mediaItem.display_order,
      thumbnail_url: mediaItem.thumbnail_url || ''
    });
  };

  const handleUpdateMedia = async (mediaId: number) => {
    try {
      const { mediaService } = await import('../../services/mediaService');
      await mediaService.updateMedia(mediaId, editMediaForm);
      setEditingMediaId(null);
      onUpdate();
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to update media');
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
      const { mediaService } = await import('../../services/mediaService');
      await mediaService.deleteMedia(mediaId);
      onUpdate();
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to delete media');
    }
  };

  const handleMoveMedia = async (mediaId: number, direction: 'up' | 'down') => {
    const currentIndex = media.findIndex(m => m.id === mediaId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= media.length) return;

    try {
      const { mediaService } = await import('../../services/mediaService');
      const reorderedMedia = [...media];
      const temp = reorderedMedia[currentIndex];
      reorderedMedia[currentIndex] = reorderedMedia[newIndex];
      reorderedMedia[newIndex] = temp;

      const mediaOrder = reorderedMedia.map((m, index) => ({
        media_id: m.id,
        display_order: index
      }));

      await mediaService.reorderMedia(themeId, mediaOrder);
      onUpdate();
    } catch (err: any) {
      onError(err.response?.data?.detail || 'Failed to reorder media');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm font-semibold text-gray-900">Media</h5>
        <button
          onClick={() => {
            setAddingMedia(true);
            setNewMediaForm({
              url: '',
              media_type: 'IMAGE',
              display_order: media.length,
              thumbnail_url: ''
            });
          }}
          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
        >
          + Add Media
        </button>
      </div>

      {/* Add Media Form */}
      {addingMedia && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <h6 className="text-xs font-semibold text-gray-900 mb-2">Add New Media</h6>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-700 mb-1">Media URL *</label>
              <input
                type="url"
                value={newMediaForm.url}
                onChange={(e) => setNewMediaForm({ ...newMediaForm, url: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">Media Type *</label>
              <select
                value={newMediaForm.media_type}
                onChange={(e) => setNewMediaForm({ ...newMediaForm, media_type: e.target.value as 'IMAGE' | 'VIDEO' })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700 mb-1">Thumbnail URL (optional)</label>
              <input
                type="url"
                value={newMediaForm.thumbnail_url}
                onChange={(e) => setNewMediaForm({ ...newMediaForm, thumbnail_url: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                placeholder="https://example.com/thumb.jpg"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddMedia}
                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setAddingMedia(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-xs hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media List */}
      {media.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-3">No media yet</p>
      ) : (
        <div className="space-y-2">
          {media.map((mediaItem, index) => (
            <div key={mediaItem.id} className="bg-gray-50 rounded p-3 border border-gray-200">
              {editingMediaId === mediaItem.id ? (
                // Edit Media Mode
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Media URL</label>
                    <input
                      type="url"
                      value={editMediaForm.url}
                      onChange={(e) => setEditMediaForm({ ...editMediaForm, url: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1">Thumbnail URL</label>
                    <input
                      type="url"
                      value={editMediaForm.thumbnail_url}
                      onChange={(e) => setEditMediaForm({ ...editMediaForm, thumbnail_url: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateMedia(mediaItem.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingMediaId(null)}
                      className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Media Mode
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    {mediaItem.media_type === 'IMAGE' && (
                      <img
                        src={mediaItem.thumbnail_url || mediaItem.url}
                        alt="Media"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    {mediaItem.media_type === 'VIDEO' && (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 font-medium">
                        {mediaItem.media_type}
                      </p>
                      <a
                        href={mediaItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline truncate block"
                      >
                        {mediaItem.url}
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        Order: {mediaItem.display_order}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditMedia(mediaItem)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleMoveMedia(mediaItem.id, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveMedia(mediaItem.id, 'down')}
                      disabled={index === media.length - 1}
                      className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(mediaItem.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}