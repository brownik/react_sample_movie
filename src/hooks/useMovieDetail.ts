import { useQuery } from '@tanstack/react-query';
import MovieService from '../services/movieService';
import type { MovieDetailResponse } from '../types/api';
import { CACHE_TIME, RETRY_COUNT } from '../constants/app';

const movieService = new MovieService();

interface UseMovieDetailParams {
  imdbId: string;
  apiKey: string;
  enabled?: boolean;
}

export function useMovieDetail({ imdbId, apiKey, enabled = true }: UseMovieDetailParams) {
  return useQuery<MovieDetailResponse, Error>({
    queryKey: ['movieDetail', imdbId, apiKey],
    queryFn: () => movieService.getMovieDetail(imdbId, apiKey),
    enabled: enabled && !!imdbId && !!apiKey,
    staleTime: CACHE_TIME.MOVIE_DETAIL,
    retry: RETRY_COUNT,
  });
}

