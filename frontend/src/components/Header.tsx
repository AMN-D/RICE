import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';

export default function Header() {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-2xl font-bold text-gray-900">Rice Showcase</h1>
              <p className="text-sm text-gray-600">Linux customizations</p>
            </div>

            {/* Auth buttons */}
            <div>
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  {/* Create Button */}
                  <button
                    onClick={() => navigate('/create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    + Create Rice
                  </button>

                  {/* Avatar */}
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="focus:outline-none focus:ring-2 focus:ring-gray-800 rounded-full"
                  >
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.username || 'User'} 
                        className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold hover:bg-gray-400 transition-colors">
                        {user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>
                  
                  <span className="text-gray-700 font-medium">{user.username}</span>
                  
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Login with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
}