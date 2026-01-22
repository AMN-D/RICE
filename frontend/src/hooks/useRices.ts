import { useState, useEffect } from 'react';
import { riceService } from '../services/riceService';
import type { Rice } from '../types';

export const useRices = (page = 1, limit = 20, sortBy = 'popular') => {
  const [rices, setRices] = useState<Rice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchRices = async () => {
      try {
        setLoading(true);
        const data = await riceService.getAllRices(page, limit, sortBy);
        setRices(data.items);
        setTotal(data.total);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError('Failed to load rices');
        console.error('Error:', err);
        setRices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRices();
  }, [page, limit, sortBy]);

  return { rices, total, totalPages, loading, error };
};