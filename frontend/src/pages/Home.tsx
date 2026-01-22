import { useState } from 'react';
import { useRices } from '../hooks/useRices';
import Header from '../components/Header';
import { RiceCard, RiceCardSkeleton } from '../components/RiceCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Terminal, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Home() {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get('sort') || 'popular';
  const [page, setPage] = useState(1);
  const limit = 16;
  const { rices, totalPages, loading, error } = useRices(page, limit, sortBy);
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={page === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <RiceCardSkeleton key={i} />)
          ) : (
            rices.map((rice) => (
              <RiceCard key={rice.id} rice={rice} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

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
