import { useRices } from '../hooks/useRices';
import Header from '../components/Header';
import { RiceCard, RiceCardSkeleton } from '../components/RiceCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Terminal, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { rices, loading, error } = useRices();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title / Hero */}
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Terminal className="w-8 h-8 text-primary" />
            Explore Rices
          </h2>
          <p className="text-muted-foreground">
            Don't browse for too long or you'll end up rebuilding everything.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Rice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <RiceCardSkeleton key={i} />)
          ) : (
            rices.map((rice) => (
              <RiceCard key={rice.id} rice={rice} />
            ))
          )}
        </div>

        {!loading && rices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-muted p-6 rounded-full mb-4">
              <SearchX className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No rices found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              It looks like there are no rices to display right now. Why not be the first to share one?
            </p>
            <Button onClick={() => navigate('/create')}>
              Create Your First Rice
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
