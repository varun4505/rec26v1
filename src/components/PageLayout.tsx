"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react'; // Added icon
import { MobileRestriction } from '@/components/MobileRestriction';
import LoadingScreen from '@/components/LoadingScreen';
import InstructionsModal from '@/components/InstructionsModal'; // Added Modal
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
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false); // Modal state
  
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'User';
  const userImage = session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

  // Handle Loading State
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

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

    const timeout = setTimeout(checkScrollable, 500);

    return () => {
      if (element) {
        element.removeEventListener('scroll', checkScrollable);
      }
      window.removeEventListener('resize', checkScrollable);
      clearTimeout(timeout);
    };
  }, [children, isLoading]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const isProfilePage = pathname === '/profile';

  if (isLoading) {
    return (
      <>
        <MobileRestriction />
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      <MobileRestriction />
      
      {/* Instructions Modal */}
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />

      <motion.div 
        className={styles.pageContainer}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
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
            
            {/* Help Button */}
            <button 
              className={styles.helpButton}
              onClick={() => setShowInstructions(true)}
              title="Guidelines & Instructions"
            >
              <HelpCircle size={22} />
            </button>

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

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      className={styles.userDropdownMenu}
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {!isProfilePage && (
                        <Link href="/profile" className={styles.dropdownItem}>
                          View Profile
                        </Link>
                      )}
                      <button onClick={handleLogout} className={styles.dropdownItem}>
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
      </motion.div>
    </>
  );
}