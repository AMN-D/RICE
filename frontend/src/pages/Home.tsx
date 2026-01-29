import { useRices } from '../hooks/useRices';
import Header from '../components/Header';
import { RiceCard, RiceCardSkeleton } from '../components/RiceCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Terminal, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaginationRange } from '@/lib/pagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TypographyH2, TypographyH3, TypographySmall, TypographyMuted } from '@/components/ui/typography';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search/Sort State from URL
  const sortBy = searchParams.get('sort') || 'popular';
  const sortOrder = searchParams.get('order') || 'desc';
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const limit = 16;
  const { rices, total, totalPages, loading, error } = useRices(page, limit, sortBy, sortOrder, query);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      if (newPage === 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', newPage.toString());
      }
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 space-y-2">
          <TypographyH2 className="flex items-center gap-2 border-b-0 pb-0">
            <Terminal className="w-8 h-8 text-primary" />
            {query ? `Search Results for "${query}"` : 'Explore Rices'}
          </TypographyH2>
          <TypographyMuted>
            {query
              ? `Found ${total} result${total !== 1 ? 's' : ''} matching your criteria.`
              : "Don't browse for too long or you'll end up rebuilding everything."
            }
          </TypographyMuted>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle><TypographySmall className="font-bold">Error</TypographySmall></AlertTitle>
            <AlertDescription><TypographySmall>{error}</TypographySmall></AlertDescription>
          </Alert>
        )}

        {/* Rice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <RiceCardSkeleton key={i} />)
          ) : (
            rices.map((rice) => <RiceCard key={rice.id} rice={rice} />)
          )}
        </div>

        {/* Empty State */}
        {!loading && rices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-muted p-6 rounded-full mb-4">
              <SearchX className="w-12 h-12 text-muted-foreground" />
            </div>
            <TypographyH3 className="mb-2">No rices found</TypographyH3>
            <TypographyMuted className="max-w-sm mb-6">
              {query
                ? "We couldn't find any rices matching your search. Try different keywords or clear the filters."
                : "It looks like there are no rices to display right now. Why not be the first to share one?"
              }
            </TypographyMuted>
            {query ? (
              <Button onClick={() => navigate('/')} variant="outline">Clear Search</Button>
            ) : (
              <Button onClick={() => navigate('/create')}>Create Your First Rice</Button>
            )}
          </div>
        )}

        {/* Pagination Section */}
        {!loading && totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {getPaginationRange(page, totalPages).map((item, index) => (
                <PaginationItem key={index}>
                  {item === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(item)}
                      isActive={page === item}
                      className="cursor-pointer"
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}
