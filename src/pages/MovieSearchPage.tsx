import { useSearchParams } from 'react-router-dom';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { SearchBar } from '../components/SearchBar';
import { MovieList } from '../components/MovieList';
import { Pagination } from '../components/Pagination';
import { ApiKeyManager } from '../components/ApiKeyManager';
import './MovieSearchPage.css';

export function MovieSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { apiKey } = useApiKey();
  
  const searchTerm = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading, error } = useMovieSearch({
    searchTerm,
    page,
    apiKey,
    enabled: !!searchTerm,
  });

  const handleSearch = (term: string) => {
    setSearchParams({ q: term, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: searchTerm, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalResults = data?.totalResults ? parseInt(data.totalResults, 10) : 0;
  const totalPages = Math.ceil(totalResults / 10);

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

        {searchTerm && (
          <>
            {data && data.totalResults && (
              <div className="search-results-info">
                총 {data.totalResults}개의 결과를 찾았습니다.
              </div>
            )}

            <MovieList
              movies={data?.Search || []}
              isLoading={isLoading}
              error={error}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
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

