"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

import styles from './Dashboard.module.css';
import DashboardHeader from './components/DashboardHeader';
import UserGreeting from './components/UserGreeting';
import DomainTabs from './components/DomainTabs';
import SubdomainSelector from './components/SubdomainSelector';

import TechDomainContent from './components/TechDomainContent';
import DesignDomainContent from './components/DesignDomainContent';
import ManagementDomainContent from './components/ManagementDomainContent';
import { MobileRestriction } from '@/components/MobileRestriction';
import PhoneNumberModal from './components/PhoneNumberModal';

export default function DashboardPage() {
  // --- State for the active tab ---
  const [activeTab, setActiveTab] = useState('Tech'); // Default to 'Tech'
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(true);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const dashboardCardRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  // Check if user has provided phone number
  useEffect(() => {
    const checkPhoneNumber = async () => {
      if (status === 'loading') return;
      if (!session?.user?.email) {
        setIsCheckingPhone(false);
        return;
      }

      try {
        const response = await fetch('/api/update-phone');
        const data = await response.json();

        if (data.success && !data.hasPhone) {
          setShowPhoneModal(true);
        }
      } catch (error) {
        console.error('Error checking phone number:', error);
      } finally {
        setIsCheckingPhone(false);
      }
    };

    checkPhoneNumber();
  }, [session, status]);

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setIsSubmittingPhone(true);
    try {
      const response = await fetch('/api/update-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        setShowPhoneModal(false);
      } else {
        alert(data.error || 'Failed to update phone number');
      }
    } catch (error) {
      console.error('Error updating phone number:', error);
      alert('Failed to update phone number. Please try again.');
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  // --- Handler function to change the tab ---
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Check if content is scrollable and handle scroll indicator
  useEffect(() => {
    const checkScrollable = () => {
      const element = dashboardCardRef.current;
      if (element) {
        const isScrollable = element.scrollHeight > element.clientHeight;
        const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
        setShowScrollIndicator(isScrollable && !isAtBottom);
      }
    };

    checkScrollable();
    const element = dashboardCardRef.current;
    if (element) {
      element.addEventListener('scroll', checkScrollable);
      window.addEventListener('resize', checkScrollable);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', checkScrollable);
      }
      window.removeEventListener('resize', checkScrollable);
    };
  }, [activeTab]);

  return (
    <>
      {/* Mobile Restriction - Only shows on mobile */}
      <MobileRestriction />

      {/* Phone Number Modal - Shows when user hasn't provided phone */}
      {showPhoneModal && (
        <PhoneNumberModal
          onSubmit={handlePhoneSubmit}
          isSubmitting={isSubmittingPhone}
        />
      )}

      {/* Desktop View */}
      <div className={styles.pageContainer}>
        <DashboardHeader />

        <main className={styles.mainContentArea}>
          {showScrollIndicator && (
            <div className={`${styles.scrollIndicator} ${!showScrollIndicator ? styles.hidden : ''}`}>
              <div className={styles.scrollArrow}></div>
              <div className={styles.scrollText}>SCROLL</div>
            </div>
          )}
          <div className={styles.dashboardCard} ref={dashboardCardRef}>

            <UserGreeting />

            {/* --- Pass state and handler to DomainTabs --- */}
            <DomainTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            {/* --- Conditional rendering based on activeTab state --- */}
            <div className={styles.domainContentWrapper}>
              {activeTab === 'Tech' && <TechDomainContent />}
              {activeTab === 'Design' && <DesignDomainContent />}
              {activeTab === 'Management' && <ManagementDomainContent />}
            </div>
          
          </div>
        </main>
      </div>
    </>
  );
}
