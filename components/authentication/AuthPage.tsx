'use client';

import { motion } from 'framer-motion';
import React, { useState, useMemo } from 'react';
import CTAButton from '@/components/ui/CTAButton';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa'; // Assuming react-icons is installed

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
    return { score: 3, text: 'Strong', color: 'text-green-500' }; // Use a standard success green
};


// --- Component for the custom input field with Muted Lavender glow ---
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showStrength?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, id, showStrength = false, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Determine input type for password toggle
  const inputType = props.type === 'password' && isPasswordVisible ? 'text' : props.type;

  // Calculate strength if requested and type is password
  const strength = useMemo(() => {
    return showStrength && props.value ? getPasswordStrength(props.value as string) : null;
  }, [showStrength, props.value]);


  return (
    <div className="w-full mb-6">
      <label htmlFor={id} className="block text-sm font-body text-text-lavender mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType} // Use calculated type
          className={`
            w-full p-4 font-body text-base bg-base-navy text-text-cream rounded-soft-lg border border-divider-silver
            transition-all duration-300 ease-[0.25, 0.1, 0.25, 1.0] pr-12
            focus:outline-none 
            ${isFocused ? 'shadow-lavender-glow border-text-lavender' : 'border-divider-silver'}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Security & UX: Password Visibility Toggle */}
        {props.type === 'password' && (
            <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-navy hover:text-highlight-wine transition-colors"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                tabIndex={-1} // Prevents button from interfering with form tab order
            >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
        )}
      </div>

      {/* Accessibility & Error Handling: Password Strength Meter */}
      {strength && strength.score > 0 && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex-1 h-1 rounded-full overflow-hidden bg-divider-silver">
                <motion.div
                    className="h-full rounded-full"
                    style={{ 
                        width: `${(strength.score / 3) * 100}%`,
                        backgroundColor: strength.color === 'text-highlight-wine' ? '#A32D4C' : 
                                         strength.color === 'text-cta-copper' ? '#C75A38' : '#22c55e' // Green-500 fallback
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
};


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading animation

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError('');
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    
    // In a real application, connect to Firebase here (simulated 1.5s delay)
    // await signInWithEmailAndPassword(auth, email, password) or await createUserWithEmailAndPassword(auth, email, password)
    setTimeout(() => {
        setIsLoading(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // If successful, navigate or update global auth state
    }, 1500);
  };

  const title = isLogin ? 'Welcome Back, Partner' : 'Create Your Exclusive Account';
  const submitLabel = isLogin ? 'Sign In' : 'Create Account';
  const switchLabel = isLogin ? 'New to Velvet Zenith?' : 'Already have an account?';
  const switchAction = isLogin ? 'Sign Up' : 'Sign In';

  // Framer Motion variant for the card entrance
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0]} 
    },
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-20 px-4"
      // Aesthetic Polish: Subtle background pattern/texture
      style={{
        backgroundColor: '#10141D', // base-navy
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(40, 36, 45, 0.2) 0%, transparent 50%), radial-gradient(at 100% 100%, rgba(40, 36, 45, 0.2) 0%, transparent 50%)',
      }}
    >
      <motion.div
        className="
          w-full max-w-md p-10 
          bg-card-taupe rounded-soft-lg 
          shadow-luxury-soft 
        "
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title (Cormorant Garamond) */}
        <h1 className="font-headings text-4xl text-text-cream font-semibold mb-2 text-center">
          {title}
        </h1>
        {/* Subtitle (Muted Lavender) */}
        <p className="font-body text-md text-text-lavender mb-10 text-center">
          Access the curated world of Zenith commerce.
        </p>

        {/* Error Message (Deep Wine Red) */}
        {error && (
            <motion.p 
                className="font-body text-center text-highlight-wine p-3 mb-4 border border-highlight-wine rounded-soft-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {error}
            </motion.p>
        )}

        <form onSubmit={handleSubmit}>
          
          <CustomInput 
            label="Email Address" 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          
          <CustomInput 
            label="Password" 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            showStrength={!isLogin} // Only show strength on signup
            required
          />

          {!isLogin && (
            <CustomInput 
              label="Confirm Password" 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          )}

          {/* Submit Button (Copper CTA) - Loading State Animation */}
          <CTAButton type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                </div>
            ) : (
                submitLabel
            )}
          </CTAButton>
        </form>

        {/* Switch Link */}
        <motion.div 
            className="text-center mt-8 pt-4 border-t border-divider-silver"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
          <p className="font-body text-text-lavender">
            {switchLabel}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-cta-copper hover:underline font-medium ml-1 transition-colors duration-300"
              type="button"
              disabled={isLoading}
            >
              {switchAction}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}