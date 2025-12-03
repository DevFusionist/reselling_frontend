'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa';

export default function AccountPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-navy">
        <div className="text-text-cream">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null; // Will redirect
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] } 
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-navy pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-card-taupe rounded-soft-lg shadow-luxury-soft p-8 md:p-12"
          >
            <h1 className="font-headings text-4xl text-text-cream font-semibold mb-2">
              Account Information
            </h1>
            <p className="font-body text-md text-text-lavender mb-8">
              Manage your Velvet Zenith account details.
            </p>

            <div className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-6 pb-6 border-b border-divider-silver">
                <div className="w-24 h-24 rounded-full bg-base-navy flex items-center justify-center">
                  {user.profile_picture_url ? (
                    <img 
                      src={user.profile_picture_url} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-6xl text-text-lavender" />
                  )}
                </div>
                <div>
                  <h2 className="font-headings text-2xl text-text-cream font-semibold">
                    {user.email.split('@')[0]}
                  </h2>
                  <p className="font-body text-text-lavender">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
                  </p>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-base-navy/50 rounded-soft-lg">
                  <FaEnvelope className="text-xl text-cta-copper mt-1" />
                  <div>
                    <p className="font-body text-sm text-text-lavender mb-1">Email Address</p>
                    <p className="font-body text-text-cream">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-base-navy/50 rounded-soft-lg">
                  <FaShieldAlt className="text-xl text-cta-copper mt-1" />
                  <div>
                    <p className="font-body text-sm text-text-lavender mb-1">Account Role</p>
                    <p className="font-body text-text-cream capitalize">{user.role}</p>
                  </div>
                </div>

                {user.created_at && (
                  <div className="flex items-start space-x-4 p-4 bg-base-navy/50 rounded-soft-lg">
                    <FaCalendarAlt className="text-xl text-cta-copper mt-1" />
                    <div>
                      <p className="font-body text-sm text-text-lavender mb-1">Member Since</p>
                      <p className="font-body text-text-cream">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
