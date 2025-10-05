import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { riceService } from '../services/riceService';
import { themeService } from '../services/themeService';
import type { Rice, ThemeCreate } from '../types';
import Header from '../components/Header';

export default function ManageRices() {
  const navigate = useNavigate();
  const [rices, setRices] = useState<Rice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRiceId, setEditingRiceId] = useState<number | null>(null);
  const [editRiceForm, setEditRiceForm] = useState({ name: '', dotfile_url: '' });
  const [expandedRiceId, setExpandedRiceId] = useState<number | null>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [editingThemeId, setEditingThemeId] = useState<number | null>(null);
  const [editThemeForm, setEditThemeForm] = useState({ name: '', description: '', tags: '' });

  useEffect(() => {
    loadRices();
  }, []);

  const loadRices = async () => {
    try {
      setLoading(true);
      const data = await riceService.getMyRices();
      setRices(data);
    } catch (err) {
      setError('Failed to load your rices');
    } finally {
      setLoading(false);
    }
  };

  const loadThemes = async (riceId: number) => {
    try {
      const data = await themeService.getThemesByRice(riceId);
      setThemes(data);
    } catch (err) {
      setError('Failed to load themes');
    }
  };

  const toggleRiceExpand = async (riceId: number) => {
    if (expandedRiceId === riceId) {
      setExpandedRiceId(null);
      setThemes([]);
    } else {
      setExpandedRiceId(riceId);
      await loadThemes(riceId);
    }
  };

  const handleEditRice = (rice: Rice) => {
    setEditingRiceId(rice.id);
    setEditRiceForm({ name: rice.name, dotfile_url: rice.dotfile_url });
  };

  const handleUpdateRice = async (id: number) => {
    try {
      await riceService.updateRice(id, editRiceForm);
      setEditingRiceId(null);
      loadRices();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update rice');
    }
  };

  const handleDeleteRice = async (id: number) => {
    if (!confirm('Are you sure you want to delete this rice?')) return;

    try {
      await riceService.deleteRice(id, true);
      loadRices();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete rice');
    }
  };

  const handleEditTheme = (theme: any) => {
    setEditingThemeId(theme.id);
    setEditThemeForm({
      name: theme.name,
      description: theme.description || '',
      tags: theme.tags || '',
    });
  };

  const handleUpdateTheme = async (themeId: number) => {
    try {
      await themeService.updateTheme(themeId, editThemeForm);
      setEditingThemeId(null);
      if (expandedRiceId) loadThemes(expandedRiceId);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update theme');
    }
  };

  const handleDeleteTheme = async (themeId: number) => {
    if (!confirm('Are you sure you want to delete this theme?')) return;

    try {
      await themeService.deleteTheme(themeId);
      if (expandedRiceId) loadThemes(expandedRiceId);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete theme');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage My Rices</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Back to Home
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <button onClick={() => setError('')} className="ml-4 underline">Dismiss</button>
          </div>
        )}

        {rices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't created any rices yet</p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Rice
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rices.map((rice) => (
              <div key={rice.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  {editingRiceId === rice.id ? (
                    // Edit Rice Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rice Name
                        </label>
                        <input
                          type="text"
                          value={editRiceForm.name}
                          onChange={(e) => setEditRiceForm({ ...editRiceForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dotfile URL
                        </label>
                        <input
                          type="url"
                          value={editRiceForm.dotfile_url}
                          onChange={(e) => setEditRiceForm({ ...editRiceForm, dotfile_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateRice(rice.id)}
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRiceId(null)}
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
                          onClick={() => handleEditRice(rice)}
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
                        >
                          Edit Rice
                        </button>
                        <button
                          onClick={() => toggleRiceExpand(rice.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          {expandedRiceId === rice.id ? 'Hide Themes' : 'Manage Themes'}
                        </button>
                        <button
                          onClick={() => handleDeleteRice(rice.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Delete Rice
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Themes Section */}
                {expandedRiceId === rice.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Themes</h3>
                    
                    {themes.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No themes yet</p>
                    ) : (
                      <div className="space-y-3">
                        {themes.map((theme) => (
                          <div key={theme.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            {editingThemeId === theme.id ? (
                              // Edit Theme Mode
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Theme Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editThemeForm.name}
                                    onChange={(e) => setEditThemeForm({ ...editThemeForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Description
                                  </label>
                                  <textarea
                                    value={editThemeForm.description}
                                    onChange={(e) => setEditThemeForm({ ...editThemeForm, description: e.target.value })}
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
                                    value={editThemeForm.tags}
                                    onChange={(e) => setEditThemeForm({ ...editThemeForm, tags: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpdateTheme(theme.id)}
                                    className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingThemeId(null)}
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
                                    onClick={() => handleEditTheme(theme)}
                                    className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTheme(theme.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
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
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}