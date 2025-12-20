'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaPlus, FaTimes, FaInfoCircle } from 'react-icons/fa';

interface ComboboxProps {
  label?: string;
  id?: string;
  options: Array<{ value: string; label: string }>;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  allowCreate?: boolean;
  onCreateNew?: (value: string) => void;
  multiple?: boolean;
  hint?: string;
  required?: boolean;
}

export default function Combobox({
  label,
  id,
  options,
  value = '',
  onChange,
  placeholder = 'Select or type to create...',
  className = '',
  error,
  allowCreate = true,
  onCreateNew,
  multiple = false,
  hint,
  required = false,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateOption, setShowCreateOption] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isClickingInsideRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking inside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setIsFocused(false);
        isClickingInsideRef.current = false;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search query
  const filteredOptions = options.filter(option => {
    const matchesSearch = option.label.toLowerCase().includes(searchQuery.toLowerCase());
    if (multiple) {
      const selectedValues = Array.isArray(value) ? value : [];
      return matchesSearch && !selectedValues.includes(option.value);
    }
    return matchesSearch;
  });

  // Show create option if search query doesn't match any option and allowCreate is true
  useEffect(() => {
    if (multiple) {
      const selectedValues = Array.isArray(value) ? value : [];
      if (allowCreate && searchQuery && 
          !filteredOptions.some(opt => opt.label.toLowerCase() === searchQuery.toLowerCase()) &&
          !selectedValues.includes(searchQuery.trim())) {
        setShowCreateOption(true);
      } else {
        setShowCreateOption(false);
      }
    } else {
      if (allowCreate && searchQuery && !filteredOptions.some(opt => opt.label.toLowerCase() === searchQuery.toLowerCase())) {
        setShowCreateOption(true);
      } else {
        setShowCreateOption(false);
      }
    }
  }, [searchQuery, filteredOptions, allowCreate, multiple, value]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
      setSearchQuery('');
      // Don't close dropdown in multi-select mode
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleCreateNew = () => {
    if (searchQuery.trim()) {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        if (!currentValues.includes(searchQuery.trim())) {
          onChange([...currentValues, searchQuery.trim()]);
          if (onCreateNew) {
            onCreateNew(searchQuery.trim());
          }
        }
        setSearchQuery('');
        // Don't close dropdown in multi-select mode
      } else {
        onChange(searchQuery.trim());
        if (onCreateNew) {
          onCreateNew(searchQuery.trim());
        }
        setIsOpen(false);
        setSearchQuery('');
      }
    }
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      onChange(currentValues.filter(v => v !== optionValue));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (!multiple) {
      onChange(newValue); // Update value as user types (single select only)
    }
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
    if (!multiple) {
      setSearchQuery(typeof value === 'string' ? value : '');
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Don't close if clicking inside the dropdown
    if (dropdownRef.current?.contains(e.relatedTarget as Node) || isClickingInsideRef.current) {
      // Reset the flag after a delay to allow for subsequent interactions
      setTimeout(() => {
        isClickingInsideRef.current = false;
      }, 100);
      return;
    }
    setIsFocused(false);
    setTimeout(() => {
      if (!isClickingInsideRef.current && !dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        if (!multiple) {
          setSearchQuery('');
        }
      }
      isClickingInsideRef.current = false;
    }, 200);
  };

  const displayValue = multiple 
    ? '' // In multi-select mode, input is always empty (shows chips instead)
    : (isOpen ? searchQuery : (options.find(opt => opt.value === value)?.label || (typeof value === 'string' ? value : '')));
  
  // Get selected values for multi-select
  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : [];
  const selectedLabels = selectedValues
    .map(val => options.find(opt => opt.value === val)?.label || val);
  
  // Custom values that aren't in options
  const customValues = selectedValues.filter(v => !options.some(opt => opt.value === v));

  return (
    <div className={`w-full mb-6 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-body text-text-lavender mb-2">
          {label}
          {required && <span className="text-highlight-wine ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <div
          className={`
            w-full ${multiple ? 'min-h-[3rem] p-2' : 'p-4'} font-body text-base bg-base-navy text-text-cream rounded-soft-lg border transition-all duration-300
            ${error ? 'border-highlight-wine' : isFocused ? 'shadow-lavender-glow border-text-lavender' : required ? 'border-cta-copper/50' : 'border-divider-silver'}
            ${multiple ? 'flex items-center flex-wrap gap-2 cursor-pointer' : 'flex items-center'}
          `}
          onMouseDown={(e) => {
            if (multiple && !inputRef.current?.contains(e.target as Node)) {
              e.preventDefault();
              e.stopPropagation();
              isClickingInsideRef.current = true;
              const willBeOpen = !isOpen;
              setIsOpen(willBeOpen);
              if (willBeOpen) {
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }
            }
          }}
        >
          {/* Selected items as chips (multi-select only) */}
          {multiple && selectedValues.length > 0 && (
            <>
              {selectedLabels.slice(0, 3).map((label, idx) => {
                const optionValue = options.find(opt => opt.label === label)?.value || selectedValues[idx];
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 bg-cta-copper/20 text-cta-copper rounded-md text-sm"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      isClickingInsideRef.current = true;
                    }}
                  >
                    {label}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        isClickingInsideRef.current = true;
                        removeOption(optionValue, e);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="ml-2 hover:text-highlight-wine"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                );
              })}
              {customValues.slice(0, Math.max(0, 3 - selectedLabels.length)).map((val, idx) => (
                <span
                  key={`custom-${idx}`}
                  className="inline-flex items-center px-3 py-1 bg-text-lavender/20 text-text-lavender rounded-md text-sm"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    isClickingInsideRef.current = true;
                  }}
                >
                  {val}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      isClickingInsideRef.current = true;
                      removeOption(val, e);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="ml-2 hover:text-highlight-wine"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </span>
              ))}
              {selectedValues.length > 3 && (
                <span className="text-text-lavender text-sm">+{selectedValues.length - 3} more</span>
              )}
            </>
          )}
          
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={multiple ? searchQuery : displayValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={multiple && selectedValues.length === 0 ? placeholder : (multiple ? '' : placeholder)}
            className={`${multiple ? 'flex-1 min-w-[120px]' : 'flex-1'} bg-transparent outline-none text-text-cream placeholder-text-lavender`}
            onMouseDown={(e) => {
              e.stopPropagation();
              isClickingInsideRef.current = true;
            }}
            onKeyDown={(e) => {
              if (multiple && e.key === 'Enter' && showCreateOption && searchQuery.trim()) {
                e.preventDefault();
                handleCreateNew();
              }
            }}
          />
          <FaChevronDown className={`ml-2 text-text-lavender transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div
            className="absolute z-50 w-full mt-2 bg-base-navy border border-divider-silver rounded-soft-lg shadow-lg max-h-60 overflow-y-auto"
            onMouseDown={(e) => {
              e.stopPropagation();
              isClickingInsideRef.current = true;
            }}
          >
            {filteredOptions.length === 0 && !showCreateOption ? (
              <div className="p-4 text-text-lavender text-center">No options available</div>
            ) : (
              <>
                {filteredOptions.map((option) => {
                  const isSelected = multiple 
                    ? (Array.isArray(value) ? value.includes(option.value) : false)
                    : value === option.value;
                  return (
                    <div
                      key={option.value}
                      className={`
                        p-3 cursor-pointer transition-colors
                        ${isSelected ? 'bg-cta-copper/20 text-cta-copper' : 'hover:bg-card-taupe text-text-cream'}
                      `}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        isClickingInsideRef.current = true;
                        handleSelect(option.value);
                      }}
                    >
                      {multiple ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mr-3 w-4 h-4 text-cta-copper bg-base-navy border-divider-silver rounded focus:ring-cta-copper"
                          />
                          <span>{option.label}</span>
                        </div>
                      ) : (
                        option.label
                      )}
                    </div>
                  );
                })}
                {showCreateOption && (
                  <div
                    className="p-3 cursor-pointer transition-colors border-t border-divider-silver hover:bg-card-taupe text-cta-copper flex items-center"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      isClickingInsideRef.current = true;
                      handleCreateNew();
                    }}
                  >
                    <FaPlus className="mr-2" />
                    <span>Create "{searchQuery}"</span>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {/* Hint Text */}
      {hint && !error && (
        <p className="text-xs text-text-lavender/70 mt-1 flex items-center">
          <FaInfoCircle className="mr-1 text-cta-copper" />
          {hint}
        </p>
      )}
      {/* Error Message */}
      {error && (
        <p className="text-xs text-highlight-wine mt-1">{error}</p>
      )}
    </div>
  );
}

