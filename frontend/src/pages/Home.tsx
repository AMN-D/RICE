import { useRices } from '../hooks/useRices';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Home() {
  const { rices, loading, error } = useRices();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading rices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Rice Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rices.map((rice) => (
            <article 
              key={rice.id}
              onClick={() => navigate(`/rice/${rice.id}`)}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Image or placeholder */}
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

        {rices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No rices found</p>
          </div>
        )}
      </main>
    </div>
  );
}