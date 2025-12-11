// src/app/dashboard/components/DashboardHeader.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import UserDropdown from './UserDropdown';

import styles from '../Dashboard.module.css';

const CLUB_LOGO_PATH = '/whiteLogoViit.svg';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'User';
  const userImage = session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    // Function to format time as HH:MM
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime(); // Set time immediately
    const intervalId = setInterval(updateTime, 1000); // Update every second

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false); // Close the menu
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerLeft}>
        <Image
          src={CLUB_LOGO_PATH}
          alt="VinnovateIT Logo"
          width={150}
          height={40}
          priority
        />
      </div>
      <div className={styles.headerRight}>
        <Link href="/" passHref>
          <button className={styles.goToHomeButton}>Go to Home</button>
        </Link>

        {/* --- Wrapper for menu and button --- */}
        <div className={styles.userMenuWrapper} ref={menuRef}>
          <div
            className={styles.userInitialCircle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ overflow: 'hidden' }}
          >
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={34}
                height={34}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              userInitial
            )}
          </div>

          {/* --- Conditionally render the dropdown --- */}
          {isMenuOpen && <UserDropdown />}
        </div>
        {/* --- End of wrapper --- */}

        <span className={styles.headerTime}>
          {currentTime || '00:00'}
        </span>
      </div>
    </header>
  );
}
