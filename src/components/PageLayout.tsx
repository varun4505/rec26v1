"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { MobileRestriction } from '@/components/MobileRestriction';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  showUserProfile?: boolean;
  cardClassName?: string;
  cardStyle?: React.CSSProperties;
}

export default function PageLayout({ 
  children, 
  actionButton, 
  showUserProfile = true,
  cardClassName,
  cardStyle
}: PageLayoutProps) {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'User';
  const userImage = session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkScrollable = () => {
      const element = cardRef.current;
      if (element) {
        const isScrollable = element.scrollHeight > element.clientHeight;
        const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
        setShowScrollIndicator(isScrollable && !isAtBottom);
      }
    };

    checkScrollable();
    const element = cardRef.current;
    if (element) {
      element.addEventListener('scroll', checkScrollable);
      window.addEventListener('resize', checkScrollable);
    }

    // A small delay to allow content to render
    const timeout = setTimeout(checkScrollable, 500);

    return () => {
      if (element) {
        element.removeEventListener('scroll', checkScrollable);
      }
      window.removeEventListener('resize', checkScrollable);
      clearTimeout(timeout);
    };
  }, [children]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <MobileRestriction />
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Image
              src="/assets/images/vinnovateit_white.svg"
              alt="VinnovateIT Logo"
              width={113}
              height={36}
              priority
            />
          </div>
          <div className={styles.headerRight}>
            {actionButton}

            {showUserProfile && (
              <div className={styles.userMenuWrapper} ref={menuRef}>
                <div
                  className={styles.userInitialCircle}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
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

                {isMenuOpen && (
                  <div className={styles.userDropdownMenu}>
                    <Link href="/profile" className={styles.dropdownLink}>
                      View Profile
                    </Link>
                    <button onClick={handleLogout} className={styles.dropdownLink}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <span className={styles.headerTime}>
              {currentTime || '00:00'}
            </span>
          </div>
        </header>

        <main className={styles.mainContentArea}>
          {showScrollIndicator && (
            <div className={`${styles.scrollIndicator} ${!showScrollIndicator ? styles.hidden : ''}`}>
              <div className={styles.scrollArrow}></div>
              <div className={styles.scrollText}>SCROLL</div>
            </div>
          )}
          <div 
            className={`${styles.card} ${cardClassName || ''}`} 
            ref={cardRef}
            style={cardStyle}
          >
            {children}
          </div>
        </main>
      </div>
    </>
  );
}