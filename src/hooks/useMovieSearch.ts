import { useQuery } from '@tanstack/react-query';
import MovieService from '../services/movieService';
import type { MovieSearchResponse } from '../types/api';
import { CACHE_TIME, RETRY_COUNT } from '../constants/app';

const movieService = new MovieService();

interface UseMovieSearchParams {
  searchTerm: string;
  page: number;
  apiKey: string;
  enabled?: boolean;
  year?: string;
  genre?: string;
}

export function useMovieSearch({ 
  searchTerm, 
  page, 
  apiKey, 
  enabled = true,
  year,
}: UseMovieSearchParams) {
  return useQuery<MovieSearchResponse, Error>({
    queryKey: ['movieSearch', searchTerm, page, apiKey, year],
    queryFn: () => movieService.searchMovies(searchTerm, page, apiKey, year),
    enabled: enabled && !!searchTerm && !!apiKey,
    staleTime: CACHE_TIME.MOVIE_SEARCH,
    retry: RETRY_COUNT,
  });
}

