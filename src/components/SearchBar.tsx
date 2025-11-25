import { useState } from 'react';
import type { FormEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  initialValue = '',
  placeholder = '영화 제목을 입력하세요...',
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        autoFocus
      />
      <button type="submit" className="search-button">
        검색
      </button>
    </form>
  );
}

