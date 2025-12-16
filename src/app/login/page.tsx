"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdNote, MdOutlineSearch } from 'react-icons/md';
import { PiWarningCircleFill } from 'react-icons/pi';

import PageLayout from '@/components/PageLayout';
import LoadingScreen from '@/components/LoadingScreen';
import styles from './Login.module.css';

const GOOGLE_LOGO_PATH = '/google-logo.svg';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'authenticated') {
    return null;
  }

  // Action Button for PageLayout (Home link)
  const ActionButton = (
    <Link href="/" passHref>
      <button className={styles.homeButton}>Home</button>
    </Link>
  );

  return (
    <PageLayout 
      actionButton={ActionButton} 
      showUserProfile={false}
      cardClassName={styles.loginCardOverride} // Optional: specific override if needed
    >
      <div className={styles.contentWrapper}>
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
            <span>Login with Google</span>
          </button>
        </div>

        {/* The Orange Div Container */}
        <div className={styles.instructionsBox}>
          
          {/* HEADER SECTION: Please Note */}
          <div className={styles.noteHeader}>
            <div className={styles.noteLabel}>
                <MdNote className="rounded-icon icon-blue" size={28} style={{ color: '#3b82f6' }} /> 
                <strong>Please Note:</strong> 
            </div>
            <div className={styles.noteContent}>
                Read all guidelines carefully before filling out the application form.
            </div>
          </div>

          {/* STACKED CARD */}
          <div className={styles.stackedCard}>
            <div className={styles.splitContainer}>
              
              {/* LEFT COLUMN: Guidelines */}
              <div className={styles.column + ' ' + styles.leftColumn}>
                <div className={styles.instructionSection}>
                  <h3>Guidelines</h3>
                  <ul>
                    <li>Perfect for freshers and sophomores looking to kickstart their innovation journey</li>
                    <li>Open to all branches - because great ideas know no boundaries</li>
                    <li>Choose your path: Technical, Management, or Design - where would you shine?</li>
                    <li>Show us your creativity and passion - perfection isn&apos;t required, enthusiasm is!</li>
                  </ul>
                  <hr className={styles.divider} />
                  <p style={{ fontStyle: 'italic', marginTop: '1rem', opacity: 0.8 }}>
                    Take the first step into becoming part of the <strong>VinnovateIT family</strong> - where innovation never sleeps!
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Important & Insider Tip */}
              <div className={styles.column + ' ' + styles.rightColumn}>
                
                {/* Box 1: Important */}
                <div className={styles.highlightBox + ' ' + styles.warningBox}>
                  <div className={styles.boxHeader}>
                        <PiWarningCircleFill className="rounded-icon icon-amber" size={26} style={{ color: '#f59e0b' }} />
                        <strong>Important</strong>
                  </div>
                  <p>
                    You can only fill this form once. Make sure all information is accurate before submitting.
                  </p>
                </div>
                  
                {/* Box 2: Insider Tip */}
                <div className={styles.highlightBox + ' ' + styles.tipBox}>
                  <div className={styles.boxHeader}>
                        <MdOutlineSearch className="rounded-icon icon-teal" size={26} style={{ color: '#14b8a6' }} />
                        <strong>Insider Tip</strong>
                  </div>
                  <p>
                    Explore the website to discover hidden surprises that could help you in future interviews! The curious ones always find the treasures.
                  </p>
                </div>

              </div>

            </div>
          </div>
          
        </div>
      </div>
    </PageLayout>
  );
}