"use client";

import React, { useState, useEffect } from 'react'; 
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

const CLUB_LOGO_PATH = '/assets/images/vinnovateit_white.svg';
const GOOGLE_LOGO_PATH = '/google-logo.svg';

export default function LoginPage() {
  const [currentTime, setCurrentTime] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className={styles.pageContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        {/* Logo (from summary) */}
        <Image 
          src={CLUB_LOGO_PATH} 
          alt="Club Logo" 
          width={150}
          height={40}
          className={styles.logo}
          priority 
        />
        
        {/* 4. Display the time using the new style */}
        <span className={styles.time}>
          {currentTime || '00:00'}
        </span>
      </header>
      
      <main className={styles.mainCard}>
        
        <h1 className={styles.welcomeTitle}>
          Welcome To VinnovateIT Recruitments
        </h1>
        
        <div className={styles.loginBar}>
          <p className={styles.loginBarText}>
            Login with your VIT Email account
          </p>
          <button 
            className={styles.googleButton} 
            onClick={handleGoogleLogin}
          >
            <Image
              src={GOOGLE_LOGO_PATH}
              alt="Google Logo"
              width={24}
              height={24}
            />
            <span>Log in with Google</span>
          </button>
        </div>

        <h2 className={styles.instructionsTitle}>
          Important Instructions :
        </h2>
        
        <div className={styles.instructionsBox}>
          {/* Instructions will go here */}
        </div>
      </main>   
    </div>
  );
}
