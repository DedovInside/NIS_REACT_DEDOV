import {useRef, useCallback} from 'react';

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

const SearchInput = ({ onSearch, placeholder = 'Search movies...' }: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    if (inputRef.current) {
      onSearch(inputRef.current.value);
    }
  }, [onSearch]);   

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="search-input">
      <input
        ref={inputRef}
        type="text"
        className="search-input-field"
        placeholder={placeholder}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchInput;