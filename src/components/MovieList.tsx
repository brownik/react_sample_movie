import { Link } from 'react-router-dom';
import type { Movie } from '../types/api';
import noPosterImage from '../assets/no-poster.svg';
import './MovieList.css';

interface MovieListProps {
  movies: Movie[];
  isLoading?: boolean;
  error: Error | null;
}

export function MovieList({ movies, error }: MovieListProps) {
  if (error) {
    const isApiKeyError = error.message.includes('API 키');
    const isServerError = error.message.includes('서버') || error.message.includes('과부하');
    const isTimeoutError = error.message.includes('시간이 초과');
    
    return (
      <div className="movie-list-error">
        <p>{error.message}</p>
        {isApiKeyError && (
          <p className="error-hint">
            헤더의 "⚙️ API 키 관리" 버튼을 클릭하여 올바른 API 키를 입력해주세요.
          </p>
        )}
        {(isServerError || isTimeoutError) && (
          <p className="error-hint">
            OMDb API 서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
            <br />
            <small>서버가 과부하 상태이거나 소켓 버퍼가 가득 찬 경우 발생할 수 있습니다.</small>
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

