import { useQueries } from '@tanstack/react-query';
import MovieService from '../services/movieService';
import { CACHE_TIME, RETRY_COUNT, RESULTS_PER_PAGE } from '../constants/app';

const movieService = new MovieService();

interface UseAllMovieSearchParams {
  searchTerm: string;
  apiKey: string;
  year?: string;
  enabled?: boolean;
}

export function useAllMovieSearch({
  searchTerm,
  apiKey,
  year,
  enabled = true,
}: UseAllMovieSearchParams) {
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

  // 전체 페이지 수만큼 쿼리 생성 (최대 100페이지로 제한 - OMDb API 제한)
  const maxPages = Math.min(totalPages, 100);
  const pageNumbers = Array.from({ length: maxPages }, (_, i) => i + 1);

  const allPagesQueries = useQueries({
    queries: pageNumbers.map((pageNum) => ({
      queryKey: ['movieSearch', searchTerm, pageNum, apiKey, year],
      queryFn: () => movieService.searchMovies(searchTerm, pageNum, apiKey, year),
      enabled: enabled && !!searchTerm && !!apiKey && !!firstPageQuery.data,
      staleTime: CACHE_TIME.MOVIE_SEARCH,
      retry: RETRY_COUNT,
    })),
  });

  const isLoading = firstPageQuery.isLoading || allPagesQueries.some((q) => q.isLoading);
  const isError = firstPageQuery.isError || allPagesQueries.some((q) => q.isError);
  const error =
    firstPageQuery.error || (allPagesQueries.find((q) => q.error)?.error as Error | undefined);

  // 모든 페이지의 영화를 하나의 배열로 합치기
  const allMovies = allPagesQueries
    .map((query) => query.data?.Search || [])
    .flat()
    .filter((movie, index, self) => {
      // 중복 제거 (같은 imdbID)
      return index === self.findIndex((m) => m.imdbID === movie.imdbID);
    });

  return {
    data: allMovies,
    isLoading,
    isError,
    error,
    totalResults,
    totalPages: maxPages,
  };
}

