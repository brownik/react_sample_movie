import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useGenreFilteredMovies } from '../hooks/useGenreFilteredMovies';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { SearchBar } from '../components/SearchBar';
import { SearchHistory } from '../components/SearchHistory';
import { MovieFilter } from '../components/MovieFilter';
import { MovieList } from '../components/MovieList';
import { MovieListSkeleton } from '../components/Skeleton';
import { Pagination } from '../components/Pagination';
import { ApiKeyManager } from '../components/ApiKeyManager';
import { RESULTS_PER_PAGE } from '../constants/app';
import './MovieSearchPage.css';

export function MovieSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { apiKey } = useApiKey();
  const { addToHistory } = useSearchHistory();
  
  const searchTerm = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const year = searchParams.get('year') || undefined;
  const genre = searchParams.get('genre') || undefined;

  // 장르 필터가 없으면 일반 검색, 있으면 장르 필터링 사용
  const { data: singlePageData, isLoading: isSinglePageLoading, error: singlePageError } = useMovieSearch({
    searchTerm,
    page,
    apiKey,
    enabled: !!searchTerm && !genre,
    year,
  });

  const {
    filteredMovies,
    isLoading: isGenreFilterLoading,
    error: genreFilterError,
    loadedPages,
  } = useGenreFilteredMovies({
    searchTerm,
    apiKey,
    year,
    genre: genre || '',
    enabled: !!searchTerm && !!genre,
  });

  // 사용할 데이터 선택
  const movies = genre ? filteredMovies : singlePageData?.Search || [];
  const isLoading = genre ? isGenreFilterLoading : isSinglePageLoading;
  const error = (genre ? genreFilterError : singlePageError) || null;

  // 페이지네이션을 위한 필터링된 결과 슬라이싱
  const paginatedMovies = useMemo(() => {
    if (!genre) {
      // 장르 필터가 없으면 현재 페이지 결과 반환
      return movies;
    }
    
    // 장르 필터가 있으면 필터링된 결과를 페이지네이션
    const startIndex = (page - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;
    return movies.slice(startIndex, endIndex);
  }, [movies, page, genre]);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      addToHistory(term.trim());
    }
    const newParams = new URLSearchParams({ q: term.trim(), page: '1' });
    if (year) newParams.set('year', year);
    if (genre) newParams.set('genre', genre);
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams({ q: searchTerm, page: newPage.toString() });
    if (year) newParams.set('year', year);
    if (genre) newParams.set('genre', genre);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleYearChange = (newYear: string) => {
    const newParams = new URLSearchParams({ q: searchTerm, page: '1' });
    if (newYear) newParams.set('year', newYear);
    if (genre) newParams.set('genre', genre);
    setSearchParams(newParams);
  };

  const handleGenreChange = (newGenre: string) => {
    const newParams = new URLSearchParams({ q: searchTerm, page: '1' });
    if (year) newParams.set('year', year);
    if (newGenre) newParams.set('genre', newGenre);
    setSearchParams(newParams);
  };

  const handleFilterReset = () => {
    setSearchParams({ q: searchTerm, page: '1' });
  };

  

  return (
    <div className="movie-search-page">
      <header className="movie-search-header">
        <h1>영화 검색</h1>
        <ApiKeyManager />
      </header>

      <div className="movie-search-content">
        <SearchBar
          onSearch={handleSearch}
          initialValue={searchTerm}
        />

        {!searchTerm && <SearchHistory onSelect={handleSearch} />}

        {searchTerm && (
          <>
            <MovieFilter
              year={year}
              genre={genre}
              onYearChange={handleYearChange}
              onGenreChange={handleGenreChange}
              onReset={handleFilterReset}
            />

            {(singlePageData || movies.length > 0 || isLoading) && (
              <div className="search-results-info">
                {genre ? (
                  <>
                    {isGenreFilterLoading ? (
                      <>
                        장르 필터링 중...
                        <span className="filter-loading"> (페이지 {loadedPages} 로딩 중...)</span>
                      </>
                    ) : (
                      <>총 {filteredMovies.length}개의 결과를 찾았습니다.</>
                    )}
                  </>
                ) : (
                  <>총 {singlePageData?.totalResults || 0}개의 결과를 찾았습니다.</>
                )}
                {(year || genre) && !isGenreFilterLoading && (
                  <span className="filter-indicator">
                    {' '}(필터 적용 중)
                  </span>
                )}
              </div>
            )}

            {isLoading ? (
              <MovieListSkeleton count={10} />
            ) : (
              <MovieList
                movies={paginatedMovies}
                isLoading={false}
                error={error}
              />
            )}

            {!isLoading && (
              <>
                {!genre && singlePageData && parseInt(singlePageData.totalResults || '0', 10) > RESULTS_PER_PAGE && (
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(parseInt(singlePageData.totalResults || '0', 10) / RESULTS_PER_PAGE)}
                    onPageChange={handlePageChange}
                  />
                )}
                {genre && filteredMovies.length > 0 && (
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(filteredMovies.length / RESULTS_PER_PAGE)}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}

        {!searchTerm && (
          <div className="movie-search-empty">
            <p>영화 제목을 검색해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}

