import { useState, useEffect } from 'react';
import { riceService } from '../services/riceService';
import type { Rice } from '../types';

export const useRices = () => {
  const [rices, setRices] = useState<Rice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRices = async () => {
      try {
        setLoading(true);
        const data = await riceService.getAllRices(1, 20);
        setRices(data);
      } catch (err) {
        setError('Failed to load rices');
        console.error('Error:', err);
        setRices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRices();
  }, []);

  return { rices, loading, error };
};