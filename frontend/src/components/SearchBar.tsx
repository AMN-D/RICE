import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { TypographySmall } from '@/components/ui/typography';

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();

  // Update input if URL changes externally
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);

    if (query.trim()) {
      newParams.set('q', query.trim());
    } else {
      newParams.delete('q');
    }

    // Always go back to page 1 on new search
    newParams.delete('page');

    navigate(`/?${newParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="relative flex items-center">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rices..."
          className="w-full pr-10"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full text-muted-foreground hover:text-foreground"
        >
          <Search className="w-5 h-5" />
          <TypographySmall className="sr-only">Search</TypographySmall>
        </Button>
      </div>
    </form>
  );
}
