import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useMovieDetail } from '../hooks/useMovieDetail';
import './MovieDetailPage.css';

export function MovieDetailPage() {
  const { imdbId } = useParams<{ imdbId: string }>();
  const navigate = useNavigate();
  const { apiKey } = useApiKey();

  const { data: movie, isLoading, error } = useMovieDetail({
    imdbId: imdbId || '',
    apiKey,
    enabled: !!imdbId,
  });

  if (isLoading) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-loading">
          <p>영화 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !movie || movie.Response === 'False') {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-error">
          <p>영화 정보를 불러올 수 없습니다.</p>
          <p>{error?.message || movie?.Error || '알 수 없는 오류'}</p>
          <Link to="/" className="back-button">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← 뒤로가기
        </button>

        <div className="movie-detail-content">
          <div className="movie-detail-poster">
            {movie.Poster !== 'N/A' ? (
              <img src={movie.Poster} alt={movie.Title} />
            ) : (
              <div className="movie-detail-poster-placeholder">
                No Image
              </div>
            )}
          </div>

          <div className="movie-detail-info">
            <h1 className="movie-detail-title">{movie.Title}</h1>
            
            <div className="movie-detail-meta">
              <span className="movie-detail-year">{movie.Year}</span>
              {movie.Rated !== 'N/A' && (
                <span className="movie-detail-rated">{movie.Rated}</span>
              )}
              {movie.Runtime !== 'N/A' && (
                <span className="movie-detail-runtime">{movie.Runtime}</span>
              )}
            </div>

            {movie.Genre !== 'N/A' && (
              <div className="movie-detail-genre">
                {movie.Genre.split(', ').map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {movie.Plot !== 'N/A' && (
              <div className="movie-detail-plot">
                <h3>줄거리</h3>
                <p>{movie.Plot}</p>
              </div>
            )}

            <div className="movie-detail-details">
              {movie.Director !== 'N/A' && (
                <div className="detail-item">
                  <strong>감독:</strong> {movie.Director}
                </div>
              )}
              {movie.Writer !== 'N/A' && (
                <div className="detail-item">
                  <strong>작가:</strong> {movie.Writer}
                </div>
              )}
              {movie.Actors !== 'N/A' && (
                <div className="detail-item">
                  <strong>출연:</strong> {movie.Actors}
                </div>
              )}
              {movie.Language !== 'N/A' && (
                <div className="detail-item">
                  <strong>언어:</strong> {movie.Language}
                </div>
              )}
              {movie.Country !== 'N/A' && (
                <div className="detail-item">
                  <strong>국가:</strong> {movie.Country}
                </div>
              )}
              {movie.Released !== 'N/A' && (
                <div className="detail-item">
                  <strong>개봉일:</strong> {movie.Released}
                </div>
              )}
            </div>

            {movie.Ratings && movie.Ratings.length > 0 && (
              <div className="movie-detail-ratings">
                <h3>평점</h3>
                <div className="ratings-list">
                  {movie.Ratings.map((rating, index) => (
                    <div key={index} className="rating-item">
                      <span className="rating-source">{rating.Source}:</span>
                      <span className="rating-value">{rating.Value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.Awards !== 'N/A' && movie.Awards && (
              <div className="movie-detail-awards">
                <strong>수상 내역:</strong> {movie.Awards}
              </div>
            )}

            {movie.BoxOffice !== 'N/A' && (
              <div className="movie-detail-boxoffice">
                <strong>박스오피스:</strong> {movie.BoxOffice}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

