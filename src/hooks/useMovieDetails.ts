import { useQueries } from '@tanstack/react-query';
import MovieService from '../services/movieService';
import type { MovieDetailResponse } from '../types/api';
import { CACHE_TIME, RETRY_COUNT } from '../constants/app';

const movieService = new MovieService();

interface UseMovieDetailsParams {
  imdbIds: string[];
  apiKey: string;
  enabled?: boolean;
}

export function useMovieDetails({ imdbIds, apiKey, enabled = true }: UseMovieDetailsParams) {
  const queries = useQueries({
    queries: imdbIds.map((imdbId) => ({
      queryKey: ['movieDetail', imdbId, apiKey],
      queryFn: () => movieService.getMovieDetail(imdbId, apiKey),
      enabled: enabled && !!imdbId && !!apiKey,
      staleTime: CACHE_TIME.MOVIE_DETAIL,
      retry: RETRY_COUNT,
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const error = queries.find((query) => query.error)?.error as Error | undefined;
  const data = queries.map((query) => query.data).filter((movie) => movie !== undefined) as MovieDetailResponse[];

  return {
    data,
    isLoading,
    isError,
    error,
  };
}

