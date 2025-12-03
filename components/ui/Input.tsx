'use client';

import { motion } from 'framer-motion';
import React, { useState, useMemo } from 'react';
import { FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';

// --- Utility: Password Strength Checker ---
const getPasswordStrength = (p: string) => {
  let score = 0;
  if (p.length < 8) return { score: 0, text: 'Too Short', color: 'text-highlight-wine' };
  if (p.match(/[a-z]/)) score++;
  if (p.match(/[A-Z]/)) score++;
  if (p.match(/[0-9]/)) score++;
  if (p.match(/[^a-zA-Z0-9]/)) score++;

  if (score <= 2) return { score: 1, text: 'Weak', color: 'text-highlight-wine' };
  if (score === 3) return { score: 2, text: 'Medium', color: 'text-cta-copper' };
  return { score: 3, text: 'Strong', color: 'text-green-500' };
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType;
  showStrength?: boolean;
  hint?: string;
  error?: string;
}

export default function Input({
  label,
  id,
  icon: Icon,
  showStrength = false,
  hint,
  error,
  type = 'text',
  className = '',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Determine input type for password toggle
  const inputType = type === 'password' && isPasswordVisible ? 'text' : type;
  
  // Remove type from props to avoid duplicate
  const { type: _, ...inputProps } = props as any;

  // Calculate strength if requested and type is password
  const strength = useMemo(() => {
    return showStrength && props.value ? getPasswordStrength(props.value as string) : null;
  }, [showStrength, props.value]);

  const hasIcon = !!Icon;
  const isPassword = type === 'password';

  return (
    <div className="w-full mb-6">
      {label && (
        <label htmlFor={id} className="block text-sm font-body text-text-lavender mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {hasIcon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-lavender text-lg z-10" />
        )}
        <input
          id={id}
          type={inputType}
          className={`
            w-full p-4 font-body text-base bg-base-navy text-text-cream rounded-soft-lg border transition-all duration-300 ease-[0.25, 0.1, 0.25, 1.0]
            ${hasIcon ? 'pl-12' : 'pl-4'}
            ${isPassword ? 'pr-12' : 'pr-4'}
            ${error ? 'border-highlight-wine' : isFocused ? 'shadow-lavender-glow border-text-lavender' : 'border-divider-silver'}
            focus:outline-none
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...inputProps}
        />
        
        {/* Password Visibility Toggle */}
        {isPassword && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-lavender hover:text-highlight-wine transition-colors z-10"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            tabIndex={-1}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
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

      {/* Password Strength Meter */}
      {strength && strength.score > 0 && (
        <div className="mt-2 flex items-center space-x-2">
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-divider-silver">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                width: `${(strength.score / 3) * 100}%`,
                backgroundColor: strength.color === 'text-highlight-wine' ? '#A32D4C' : 
                                 strength.color === 'text-cta-copper' ? '#C75A38' : '#22c55e'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(strength.score / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className={`text-xs font-body ${strength.color}`}>{strength.text}</p>
        </div>
      )}
    </div>
  );
}

