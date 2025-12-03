'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import AuthPage from '@/components/authentication/AuthPage';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return null; // Or a loading spinner
  }

  if (isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <>
      {/* <Navbar /> */}
      <AuthPage initialMode="login" />
      {/* <Footer /> */}
    </>
  );
}

