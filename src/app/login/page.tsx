"use client";

import React, { useState, useEffect } from 'react'; 
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// --- UPDATED ICONS: Using Material Design Rounded for a smoother look ---
import { MdNote , MdOutlineSearch } from 'react-icons/md';
import { PiWarningCircleFill } from 'react-icons/pi';
import PageLayout from '@/components/PageLayout';
import styles from './Login.module.css';

const GOOGLE_LOGO_PATH = '/google-logo.svg';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
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

  if (status === 'loading') {
    return (
      <div className={styles.pageContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  // Override inner card style to match Figma/Login design
  const cardStyle: React.CSSProperties = {
    maxWidth: '1440px',
    minHeight: '650px',
    backgroundColor: '#e8e8e8',
    padding: '40px 56px',
    margin: '0 auto',
    borderRadius: '40px',
    color: '#212121'
  };

  return (
    <PageLayout showUserProfile={false} cardStyle={cardStyle}>
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
            {/* The Label Group (Icon + Title) */}
            <div className={styles.noteLabel}>
                {/* Icon: Blue Clipboard */}
                <MdNote className="rounded-icon icon-blue" size={28} /> 
                <strong>Please Note:</strong> 
            </div>
            {/* The Text Content */}
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
                  <p style={{ fontStyle: 'italic' }}>
                    Take the first step into becoming part of the <strong>VinnovateIT family</strong> - where innovation never sleeps!
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Important & Insider Tip (Now in boxes) */}
              <div className={styles.column + ' ' + styles.rightColumn + ' ' + styles.centeredColumn}>
                
                {/* Box 1: Important */}
                <div className={styles.highlightBox + ' ' + styles.warningBox}>
                  <div className={styles.boxHeader}>
                        {/* Icon: Amber Warning */}
                        <PiWarningCircleFill className="rounded-icon icon-amber" size={26} />
                        <strong>Important</strong>
                  </div>
                  <p>
                    You can only fill this form once. Make sure all information is accurate before submitting.
                  </p>
                </div>
                  
                {/* Box 2: Insider Tip */}
                <div className={styles.highlightBox + ' ' + styles.tipBox}>
                  <div className={styles.boxHeader}>
                        {/* Icon: Teal Tips/Lightbulb */}
                        <MdOutlineSearch className="rounded-icon icon-teal" size={26} />
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
    </PageLayout>
  );
}

function setCurrentTime(arg0: string) {
  throw new Error('Function not implemented.');
}
