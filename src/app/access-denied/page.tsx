"use client";

import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import styles from './AccessDenied.module.css';

const CLUB_LOGO_PATH = '/assets/images/vinnovateit_white.svg';

export default function AccessDeniedPage() {
  const [currentTime, setCurrentTime] = useState('');

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

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Image 
          src={CLUB_LOGO_PATH} 
          alt="Club Logo" 
          width={150}
          height={40}
          className={styles.logo}
          priority 
        />
        <span className={styles.time}>
          {currentTime || '00:00'}
        </span>
      </header>

      <main className={styles.card}>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          Only students from the <strong>2024</strong> or <strong>2025</strong> batch are eligible to access this portal.
        </p>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })} 
          className={styles.button}
        >
          Sign Out & Return to Login
        </button>
      </main>
    </div>
  );
}
