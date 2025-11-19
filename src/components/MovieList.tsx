import { Link } from 'react-router-dom';
import type { Movie } from '../types/api';
import noPosterImage from '../assets/no-poster.svg';
import './MovieList.css';

interface MovieListProps {
  movies: Movie[];
  isLoading: boolean;
  error: Error | null;
}

export function MovieList({ movies, isLoading, error }: MovieListProps) {
  if (isLoading) {
    return (
      <div className="movie-list-loading">
        <p>영화를 검색하는 중...</p>
      </div>
    );
  }

  if (error) {
    const isApiKeyError = error.message.includes('API 키');
    return (
      <div className="movie-list-error">
        <p>{error.message}</p>
        {isApiKeyError && (
          <p className="error-hint">
            헤더의 "⚙️ API 키 관리" 버튼을 클릭하여 올바른 API 키를 입력해주세요.
          </p>
        )}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="movie-list-empty">
        <p>검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <Link
          key={movie.imdbID}
          to={`/movie/${movie.imdbID}`}
          className="movie-card"
        >
          <div className="movie-poster">
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : noPosterImage}
              alt={movie.Title}
              onError={(event) => {
                const target = event.currentTarget;
                if (target.src !== noPosterImage) {
                  target.src = noPosterImage;
                }
              }}
              loading="lazy"
            />
          </div>
          <div className="movie-info">
            <h3 className="movie-title">{movie.Title}</h3>
            <p className="movie-year">{movie.Year}</p>
            <p className="movie-type">{movie.Type}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

