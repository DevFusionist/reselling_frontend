'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { isLoggedIn, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/account');
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-base-navy pt-20 pb-20 flex items-center justify-center">
          <p className="font-body text-xl text-text-lavender">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-navy pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="font-headings text-5xl text-text-cream font-semibold mb-4">
            Dashboard
          </h1>
          <p className="font-body text-xl text-text-lavender">
            Welcome to your exclusive dashboard. This is a protected route.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

