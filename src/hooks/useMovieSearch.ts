import { useQuery } from '@tanstack/react-query';
import MovieService from '../services/movieService';
import type { MovieSearchResponse } from '../types/api';

const movieService = new MovieService();

interface UseMovieSearchParams {
  searchTerm: string;
  page: number;
  apiKey: string;
  enabled?: boolean;
}

export function useMovieSearch({ searchTerm, page, apiKey, enabled = true }: UseMovieSearchParams) {
  return useQuery<MovieSearchResponse, Error>({
    queryKey: ['movieSearch', searchTerm, page, apiKey],
    queryFn: () => movieService.searchMovies(searchTerm, page, apiKey),
    enabled: enabled && !!searchTerm && !!apiKey,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });
}

