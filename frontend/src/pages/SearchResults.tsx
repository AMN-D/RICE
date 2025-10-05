import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { riceService } from '../services/riceService';
import type { Rice } from '../types';
import Header from '../components/Header';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [rices, setRices] = useState<Rice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      searchRices(query);
    }
  }, [query]);

  const searchRices = async (searchQuery: string) => {
    try {
      setLoading(true);
      const data = await riceService.searchRices(searchQuery);
      setRices(data);
    } catch (err) {
      setError('Failed to search rices');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Searching...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            Found {rices.length} result{rices.length !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {rices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No rices found matching your search</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rices.map((rice) => (
              <article 
                key={rice.id}
                onClick={() => navigate(`/rice/${rice.id}`)}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white"
              >
                {rice.preview_image ? (
                  <img 
                    src={rice.preview_image} 
                    alt={rice.name}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No preview</span>
                  </div>
                )}
                
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {rice.name}
                  </h2>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{rice.views} views</span>
                    {rice.avg_rating && (
                      <span className="text-yellow-600">★ {rice.avg_rating.toFixed(1)}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{rice.themes_count} themes</span>
                    <span>{rice.reviews_count} reviews</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}