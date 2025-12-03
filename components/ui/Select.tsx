'use client';

import React, { useState } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export default function Select({
  label,
  id,
  error,
  options,
  className = '',
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full mb-6">
      {label && (
        <label htmlFor={id} className="block text-sm font-body text-text-lavender mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`
            w-full p-4 font-body text-base bg-base-navy text-text-cream rounded-soft-lg border appearance-none transition-all duration-300 ease-[0.25, 0.1, 0.25, 1.0]
            ${error ? 'border-highlight-wine' : isFocused ? 'shadow-lavender-glow border-text-lavender' : 'border-divider-silver'}
            focus:outline-none
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-text-lavender"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs text-highlight-wine mt-1">{error}</p>
      )}
    </div>
  );
}

