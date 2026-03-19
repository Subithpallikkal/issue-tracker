import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Issue, Paginated } from '@/types/issue';

export function useIssues(params?: { page?: number; limit?: number }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [page, setPage] = useState(params?.page ?? 1);
  const [limit, setLimit] = useState(params?.limit ?? 10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getIssues({ page, limit });
      setIssues((data as Paginated<Issue>).items || []);
      setTotal((data as Paginated<Issue>).total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch issues');
    } finally {
      setIsLoading(false);
    }
  }, [limit, page]);

  const deleteIssue = async (uid: number) => {
    try {
      await api.deleteIssue(uid);
      setIssues(prev => prev.filter(issue => issue.uid !== uid));
      setTotal((t) => Math.max(0, t - 1));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete issue');
      return false;
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return {
    issues,
    isLoading,
    error,
    fetchIssues,
    deleteIssue,
    page,
    limit,
    total,
    setPage,
    setLimit,
  };
}
