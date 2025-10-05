import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService, type PublicUser } from '../services/userService';
import type { Rice } from '../types';
import Header from '../components/Header';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [rices, setRices] = useState<Rice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadUserData(parseInt(id));
    }
  }, [id]);

  const loadUserData = async (userId: number) => {
    try {
      setLoading(true);
      setError('');
      
      const [userData, ricesData] = await Promise.all([
        userService.getUserById(userId),
        userService.getUserRices(userId)
      ]);
      
      setUser(userData);
      setRices(ricesData);
    } catch (err: any) {
      console.error('Error loading user data:', err);
      setError(err.response?.data?.detail || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  // Determine which image to display (picture takes precedence over avatar_url)
  const getProfileImage = (): string | null => {
    return user?.picture || user?.avatar_url || null;
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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 mb-4">{error || 'User not found'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profileImage = getProfileImage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={user.name || user.username}
                  className="w-32 h-32 rounded-full border-4 border-gray-200 object-cover shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
                  {user.username[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 w-full">
              {/* Name and Username */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {user.name || user.username}
                </h1>
                <p className="text-lg text-gray-500">@{user.username}</p>
              </div>
              
              {/* Bio */}
              {user.bio && (
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                </div>
              )}
              
              {/* Stats and Links */}
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium">{rices.length}</span>
                  <span>rice{rices.length !== 1 ? 's' : ''}</span>
                </div>

                {user.github_url && (
                  <>
                    <span className="text-gray-300">•</span>
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub Profile
                    </a>
                  </>
                )}
              </div>

              {/* API Data Details (Developer Info) */}
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                  View API Data
                </summary>
                <div className="mt-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <dl className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-600">User ID:</dt>
                      <dd className="text-gray-900 font-mono">{user.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-600">Username:</dt>
                      <dd className="text-gray-900 font-mono">{user.username}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-gray-600">Name:</dt>
                      <dd className="text-gray-900">{user.name || <span className="text-gray-400 italic">Not set</span>}</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="font-medium text-gray-600">Bio:</dt>
                      <dd className="text-gray-900">{user.bio || <span className="text-gray-400 italic">Not set</span>}</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="font-medium text-gray-600">Avatar URL:</dt>
                      <dd className="text-gray-900 break-all text-xs">
                        {user.avatar_url ? (
                          <a href={user.avatar_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {user.avatar_url}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="font-medium text-gray-600">Picture:</dt>
                      <dd className="text-gray-900 break-all text-xs">
                        {user.picture ? (
                          <a href={user.picture} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {user.picture}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1">
                      <dt className="font-medium text-gray-600">GitHub URL:</dt>
                      <dd className="text-gray-900 break-all text-xs">
                        {user.github_url ? (
                          <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {user.github_url}
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* User's Rices */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Rices by {user.name || user.username}
          </h2>

          {rices.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 text-lg">No rices posted yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rices.map((rice) => (
                <article 
                  key={rice.id}
                  onClick={() => navigate(`/rice/${rice.id}`)}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer bg-white transform hover:-translate-y-1"
                >
                  {rice.preview_image ? (
                    <img 
                      src={rice.preview_image} 
                      alt={rice.name}
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                      {rice.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {rice.views}
                      </span>
                      {rice.avg_rating && (
                        <span className="flex items-center gap-1 text-yellow-600 font-medium">
                          ★ {rice.avg_rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span>{rice.themes_count} theme{rice.themes_count !== 1 ? 's' : ''}</span>
                      <span>{rice.reviews_count} review{rice.reviews_count !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}