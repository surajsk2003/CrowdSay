'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollProps<T> {
  fetchMore: (page: number) => Promise<T[]>;
  hasMore: boolean;
  initialPage?: number;
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  ref: (node?: Element | null) => void;
  inView: boolean;
  reset: () => void;
  setItems: (items: T[]) => void;
}

export function useInfiniteScroll<T>({
  fetchMore,
  hasMore: hasMoreProp,
  initialPage = 1,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(hasMoreProp);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newItems = await fetchMore(page);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prevItems => [...prevItems, ...newItems]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more items');
    } finally {
      setLoading(false);
    }
  }, [fetchMore, page, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(hasMoreProp);
    setError(null);
    setLoading(false);
  }, [initialPage, hasMoreProp]);

  // Load more when in view
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  // Update hasMore when prop changes
  useEffect(() => {
    setHasMore(hasMoreProp);
  }, [hasMoreProp]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    ref,
    inView,
    reset,
    setItems,
  };
}