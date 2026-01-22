import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { riceService } from '../services/riceService';
import type { Rice } from '../types';
import Header from '../components/Header';
import RiceItem from '../components/manage/RiceItem';

export default function ManageRices() {
  const navigate = useNavigate();
  const [rices, setRices] = useState<Rice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRices();
  }, []);

  const loadRices = async () => {
    try {
      setLoading(true);
      const data = await riceService.getMyRices();
      setRices(data.items);
    } catch (err) {
      setError('Failed to load your rices');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
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
              <RiceItem
                key={rice.id}
                rice={rice}
                onUpdate={loadRices}
                onError={handleError}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}