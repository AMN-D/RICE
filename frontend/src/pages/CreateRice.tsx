import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { riceService } from '../services/riceService';
import type { RiceCreate, ThemeCreate, MediaCreate } from '../types';
import Header from '../components/Header';

export default function CreateRice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [riceName, setRiceName] = useState('');
  const [dotfileUrl, setDotfileUrl] = useState('');
  const [themes, setThemes] = useState<ThemeCreate[]>([
    {
      name: '',
      description: '',
      tags: '',
      display_order: 0,
      media: [{ url: '', media_type: 'IMAGE', display_order: 0 }]
    }
  ]);

  const addTheme = () => {
    setThemes([
      ...themes,
      {
        name: '',
        description: '',
        tags: '',
        display_order: themes.length,
        media: [{ url: '', media_type: 'IMAGE', display_order: 0 }]
      }
    ]);
  };

  const removeTheme = (index: number) => {
    setThemes(themes.filter((_, i) => i !== index));
  };

  const updateTheme = (index: number, field: keyof ThemeCreate, value: any) => {
    const updated = [...themes];
    updated[index] = { ...updated[index], [field]: value };
    setThemes(updated);
  };

  const addMedia = (themeIndex: number) => {
    const updated = [...themes];
    const currentMedia = updated[themeIndex].media;
    updated[themeIndex].media = [
      ...currentMedia,
      { url: '', media_type: 'IMAGE', display_order: currentMedia.length }
    ];
    setThemes(updated);
  };

  const removeMedia = (themeIndex: number, mediaIndex: number) => {
    const updated = [...themes];
    updated[themeIndex].media = updated[themeIndex].media.filter((_, i) => i !== mediaIndex);
    setThemes(updated);
  };

  const updateMedia = (themeIndex: number, mediaIndex: number, field: keyof MediaCreate, value: any) => {
    const updated = [...themes];
    updated[themeIndex].media[mediaIndex] = {
      ...updated[themeIndex].media[mediaIndex],
      [field]: value
    };
    setThemes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!riceName.trim()) {
      setError('Rice name is required');
      return;
    }

    if (!dotfileUrl.trim()) {
      setError('Dotfile URL is required');
      return;
    }

    setLoading(true);

    try {
      const riceData: RiceCreate = {
        name: riceName,
        dotfile_url: dotfileUrl,
        themes: themes
      };

      await riceService.createRice(riceData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create rice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Rice</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rice Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={riceName}
                  onChange={(e) => setRiceName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="My Awesome Rice"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dotfile URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={dotfileUrl}
                  onChange={(e) => setDotfileUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                  placeholder="https://github.com/user/dotfiles"
                />
              </div>
            </div>

            {/* Themes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Themes</h2>
                <button
                  type="button"
                  onClick={addTheme}
                  className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
                >
                  + Add Theme
                </button>
              </div>

              {themes.map((theme, themeIndex) => (
                <div key={themeIndex} className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Theme {themeIndex + 1}</h3>
                    {themes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTheme(themeIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove Theme
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme Name</label>
                    <input
                      type="text"
                      value={theme.name}
                      onChange={(e) => updateTheme(themeIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                      placeholder="Dark Mode"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={theme.description}
                      onChange={(e) => updateTheme(themeIndex, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                      placeholder="A clean dark theme..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <input
                      type="text"
                      value={theme.tags}
                      onChange={(e) => updateTheme(themeIndex, 'tags', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                      placeholder="dark, minimal, nord"
                    />
                  </div>

                  {/* Media */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Media</h4>
                      <button
                        type="button"
                        onClick={() => addMedia(themeIndex)}
                        className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                      >
                        + Add Media
                      </button>
                    </div>

                    {theme.media.map((media, mediaIndex) => (
                      <div key={mediaIndex} className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Media {mediaIndex + 1}</span>
                          {theme.media.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedia(themeIndex, mediaIndex)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Media URL</label>
                          <input
                            type="url"
                            value={media.url}
                            onChange={(e) => updateMedia(themeIndex, mediaIndex, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                            placeholder="https://example.com/image.png"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={media.media_type}
                              onChange={(e) => updateMedia(themeIndex, mediaIndex, 'media_type', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                            >
                              <option value="IMAGE">Image</option>
                              <option value="VIDEO">Video</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Thumbnail URL (optional)</label>
                            <input
                              type="url"
                              value={media.thumbnail_url || ''}
                              onChange={(e) => updateMedia(themeIndex, mediaIndex, 'thumbnail_url', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                              placeholder="https://example.com/thumb.png"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Creating...' : 'Create Rice'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}