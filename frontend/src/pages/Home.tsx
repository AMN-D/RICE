import { useRices } from '../hooks/useRices';

export default function Home() {
  const { rices, loading, error } = useRices();

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
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Rice Showcase</h1>
          <p className="mt-2 text-gray-600">Discover and share Linux customizations</p>
        </div>
      </header>

      {/* Rice Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rices.map((rice) => (
            <article 
              key={rice.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Placeholder for image - we'll add this later */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {rice.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {rice.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{rice.distro}</span>
                  {rice.window_manager && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {rice.window_manager}
                    </span>
                  )}
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