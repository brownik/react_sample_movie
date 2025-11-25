import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import MovieService from '../services/movieService';
import type { MovieDetailResponse } from '../types/api';
import { CACHE_TIME, RETRY_COUNT, RESULTS_PER_PAGE } from '../constants/app';

const movieService = new MovieService();

interface UseGenreFilteredMoviesParams {
  searchTerm: string;
  apiKey: string;
  year?: string;
  genre: string;
  enabled?: boolean;
}

/**
 * 장르 필터링을 위한 훅
 * 페이지별로 점진적으로 로딩하여 성능 최적화
 */
export function useGenreFilteredMovies({
  searchTerm,
  apiKey,
  year,
  genre,
  enabled = true,
}: UseGenreFilteredMoviesParams) {
  // 먼저 첫 페이지를 가져와서 전체 결과 수 확인
  const firstPageQuery = useQueries({
    queries: [
      {
        queryKey: ['movieSearch', searchTerm, 1, apiKey, year],
        queryFn: () => movieService.searchMovies(searchTerm, 1, apiKey, year),
        enabled: enabled && !!searchTerm && !!apiKey,
        staleTime: CACHE_TIME.MOVIE_SEARCH,
        retry: RETRY_COUNT,
      },
    ],
  })[0];

  const totalResults = firstPageQuery.data?.totalResults
    ? parseInt(firstPageQuery.data.totalResults, 10)
    : 0;
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  // 현재까지 로드된 페이지들 (점진적 로딩을 위해 처음에는 첫 페이지만)
  // 사용자가 페이지를 이동하면 해당 페이지까지 로드
  // 최대 100페이지로 제한
  const maxPages = Math.min(totalPages, 100);
  
  // 현재는 첫 페이지만 로드 (나중에 페이지 이동 시 확장 가능)
  const pagesToLoad = [1];

  const pagesQueries = useQueries({
    queries: pagesToLoad.map((pageNum) => ({
      queryKey: ['movieSearch', searchTerm, pageNum, apiKey, year],
      queryFn: () => movieService.searchMovies(searchTerm, pageNum, apiKey, year),
      enabled: enabled && !!searchTerm && !!apiKey && !!firstPageQuery.data,
      staleTime: CACHE_TIME.MOVIE_SEARCH,
      retry: RETRY_COUNT,
    })),
  });

  // 모든 페이지의 영화를 하나의 배열로 합치기
  const allMovies = useMemo(() => {
    return pagesQueries
      .map((query) => query.data?.Search || [])
      .flat()
      .filter((movie, index, self) => {
        // 중복 제거 (같은 imdbID)
        return index === self.findIndex((m) => m.imdbID === movie.imdbID);
      });
  }, [pagesQueries]);

  // 상세 정보 가져오기
  const imdbIds = useMemo(() => {
    return allMovies.map((movie) => movie.imdbID);
  }, [allMovies]);

  const detailsQueries = useQueries({
    queries: imdbIds.map((imdbId) => ({
      queryKey: ['movieDetail', imdbId, apiKey],
      queryFn: () => movieService.getMovieDetail(imdbId, apiKey),
      enabled: enabled && !!imdbId && !!apiKey,
      staleTime: CACHE_TIME.MOVIE_DETAIL,
      retry: RETRY_COUNT,
    })),
  });

  const movieDetails = useMemo(() => {
    return detailsQueries
      .map((query) => query.data)
      .filter((detail): detail is MovieDetailResponse => detail !== undefined);
  }, [detailsQueries]);

  // 장르로 필터링
  const filteredMovies = useMemo(() => {
    if (allMovies.length === 0) return [];

    const genreFilteredIds = new Set(
      movieDetails
        .filter((detail) => {
          if (!detail.Genre || detail.Genre === 'N/A') return false;
          const genres = detail.Genre.split(', ').map((g) => g.trim());
          return genres.includes(genre);
        })
        .map((detail) => detail.imdbID)
    );

    return allMovies.filter((movie) => genreFilteredIds.has(movie.imdbID));
  }, [allMovies, movieDetails, genre]);

  const isLoading =
    firstPageQuery.isLoading ||
    pagesQueries.some((q) => q.isLoading) ||
    detailsQueries.some((q) => q.isLoading);

  const isError =
    firstPageQuery.isError ||
    pagesQueries.some((q) => q.isError) ||
    detailsQueries.some((q) => q.isError);

  const error =
    firstPageQuery.error ||
    pagesQueries.find((q) => q.error)?.error ||
    detailsQueries.find((q) => q.error)?.error;

  return {
    filteredMovies,
    isLoading,
    isError,
    error: error as Error | undefined,
    totalResults,
    totalPages: maxPages,
    loadedPages: pagesToLoad.length,
  };
}

