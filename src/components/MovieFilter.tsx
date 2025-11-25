import { useState, useEffect } from 'react';
import { GENRES } from '../constants/omdb';
import './MovieFilter.css';

interface MovieFilterProps {
  year?: string;
  genre?: string;
  onYearChange: (year: string) => void;
  onGenreChange: (genre: string) => void;
  onReset: () => void;
}

export function MovieFilter({
  year,
  genre,
  onYearChange,
  onGenreChange,
  onReset,
}: MovieFilterProps) {
  const [localYear, setLocalYear] = useState(year || '');
  const [localGenre, setLocalGenre] = useState(genre || '');

  useEffect(() => {
    setLocalYear(year || '');
  }, [year]);

  useEffect(() => {
    setLocalGenre(genre || '');
  }, [genre]);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocalGenre(value);
    onGenreChange(value);
  };

  const handleReset = () => {
    setLocalYear('');
    setLocalGenre('');
    onReset();
  };

  const hasFilters = localYear || localGenre;

  // 연도 목록 생성 (최근 30년)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="movie-filter">
      <div className="movie-filter-header">
        <h3>필터</h3>
        {hasFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="movie-filter-reset"
            aria-label="필터 초기화"
          >
            초기화
          </button>
        )}
      </div>

      <div className="movie-filter-controls">
        <div className="movie-filter-group">
          <label htmlFor="year-filter" className="movie-filter-label">
            연도
          </label>
          <select
            id="year-filter"
            value={localYear}
            onChange={(e) => {
              setLocalYear(e.target.value);
              onYearChange(e.target.value);
            }}
            className="movie-filter-select"
          >
            <option value="">전체</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="movie-filter-group">
          <label htmlFor="genre-filter" className="movie-filter-label">
            장르 <span className="filter-note">(상세 정보에서만 확인 가능)</span>
          </label>
          <select
            id="genre-filter"
            value={localGenre}
            onChange={handleGenreChange}
            className="movie-filter-select"
            title="OMDb API는 검색 결과에 장르 정보를 포함하지 않아 장르 필터는 제한적으로 동작합니다"
          >
            <option value="">전체</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

