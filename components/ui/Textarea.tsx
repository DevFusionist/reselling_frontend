'use client';

import React, { useState } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function Textarea({
  label,
  id,
  error,
  className = '',
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full mb-6">
      <label htmlFor={id} className="block text-sm font-body text-text-lavender mb-2">
        {label}
      </label>
      <textarea
        id={id}
        className={`
          w-full p-4 font-body text-base bg-base-navy text-text-cream rounded-soft-lg border transition-all duration-300 ease-[0.25, 0.1, 0.25, 1.0] min-h-[150px]
          ${error ? 'border-highlight-wine' : isFocused ? 'shadow-lavender-glow border-text-lavender' : 'border-divider-silver'}
          focus:outline-none resize-y
          ${className}
        `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <p className="text-xs text-highlight-wine mt-1">{error}</p>
      )}
    </div>
  );
}

