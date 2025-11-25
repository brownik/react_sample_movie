import { useSearchHistory } from '../hooks/useSearchHistory';
import './SearchHistory.css';

interface SearchHistoryProps {
  onSelect: (term: string) => void;
  currentTerm?: string;
}

export function SearchHistory({ onSelect, currentTerm }: SearchHistoryProps) {
  const { history, removeFromHistory, clearHistory } = useSearchHistory();

  if (history.length === 0) {
    return null;
  }

  const filteredHistory = history.filter((term) => term !== currentTerm);

  if (filteredHistory.length === 0) {
    return null;
  }

  return (
    <div className="search-history">
      <div className="search-history-header">
        <h3>최근 검색어</h3>
        <button
          type="button"
          onClick={clearHistory}
          className="search-history-clear"
          aria-label="검색 히스토리 모두 삭제"
        >
          전체 삭제
        </button>
      </div>
      <ul className="search-history-list">
        {filteredHistory.slice(0, 10).map((term) => (
          <li key={term} className="search-history-item">
            <button
              type="button"
              onClick={() => onSelect(term)}
              className="search-history-term"
            >
              {term}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFromHistory(term);
              }}
              className="search-history-remove"
              aria-label={`${term} 삭제`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

