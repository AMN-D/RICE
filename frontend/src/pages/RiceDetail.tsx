import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { riceService } from '../services/riceService';
import { userService } from '../services/userService';
import type { Rice } from '../types';
import Header from '../components/Header';

interface UserInfo {
  id: number;
  username: string;
  avatar_url: string | null;
}

export default function RiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rice, setRice] = useState<Rice | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadRice(parseInt(id));
    }
  }, [id]);

  const loadRice = async (riceId: number) => {
    try {
      setLoading(true);
      const riceData = await riceService.getRiceById(riceId);
      setRice(riceData);
      
      // Fetch user info
      const userData = await userService.getUserById(riceData.user_id);
      setUser(userData);
    } catch (err) {
      setError('Failed to load rice details');
    } finally {
      setLoading(false);
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

  if (error || !rice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 mb-4">{error || 'Rice not found'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Home
        </button>

        {/* Rice Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{rice.name}</h1>
            
            {/* User Info */}
            {user && (
              <div 
                onClick={() => navigate(`/user/${user.id}`)}
                className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80 w-fit"
              >
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.username}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Posted by</p>
                  <p className="font-medium text-gray-900">{user.username}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <span>{rice.views} views</span>
              <span>{rice.reviews_count} reviews</span>
              {rice.avg_rating && (
                <span className="flex items-center gap-1">
                  <span className="text-yellow-600">★</span>
                  {rice.avg_rating.toFixed(1)}
                </span>
              )}
            </div>

            <a
              href={rice.dotfile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Dotfiles →
            </a>
          </div>
        </div>

        {/* Themes */}
        {rice.themes && rice.themes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Themes</h2>
            
            {rice.themes.map((theme) => (
              <div key={theme.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {theme.name}
                  </h3>
                  
                  {theme.description && (
                    <p className="text-gray-600 mb-4">{theme.description}</p>
                  )}

                  {theme.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {theme.tags.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Media Gallery */}
                  {theme.media && theme.media.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {theme.media.map((media) => (
                        <div key={media.id} className="relative group">
                          {media.media_type === 'IMAGE' ? (
                            <img
                              src={media.media_url}
                              alt={`${theme.name} media`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500">Video</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Themes */}
        {(!rice.themes || rice.themes.length === 0) && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No themes available for this rice yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}