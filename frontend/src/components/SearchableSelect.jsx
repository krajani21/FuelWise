import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  onSearch,
  placeholder = "Search...",
  label,
  required = false,
  disabled = false,
  loading = false,
  error = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setHighlightedIndex(-1);

    if (onSearch) {
      try {
        await onSearch(term);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      // Local filtering if no onSearch function provided
      const filtered = options.filter(option =>
        option.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-[#333333] mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <div
        className={`relative w-full px-4 py-3 border rounded-lg cursor-pointer transition-all duration-200 ${
          error 
            ? 'border-red-300 bg-red-50' 
            : disabled 
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
              : isOpen 
                ? 'border-[#4CAF50] ring-2 ring-[#4CAF50] ring-opacity-20' 
                : 'border-gray-300 hover:border-[#4CAF50]'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isOpen ? (
              <div className="flex items-center">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full bg-transparent outline-none"
                  autoFocus
                  disabled={disabled}
                />
              </div>
            ) : (
              <div className="flex items-center">
                <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                  {value || placeholder}
                </span>
                {value && !disabled && (
                  <button
                    onClick={clearSelection}
                    className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center ml-2">
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4CAF50] mr-2"></div>
            )}
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === highlightedIndex 
                    ? 'bg-[#4CAF50] text-white' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              {loading ? 'Loading...' : 'No options found'}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SearchableSelect;

