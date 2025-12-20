'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import CTAButton from '@/components/ui/CTAButton';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';


interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

export default function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
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
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
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
          
          <Input 
            label="Email Address" 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          
          <Input 
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
            <Input 
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
            {submitLabel}
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
                // Navigate to the other auth page when switching
                router.push(isLogin ? '/signup' : '/login');
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