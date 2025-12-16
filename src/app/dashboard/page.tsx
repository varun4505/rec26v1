"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import styles from './Dashboard.module.css';
import PageLayout from '@/components/PageLayout';
import UserGreeting from './components/UserGreeting';
import DomainTabs from './components/DomainTabs';

import TechDomainContent from './components/TechDomainContent';
import DesignDomainContent from './components/DesignDomainContent';
import ManagementDomainContent from './components/ManagementDomainContent';
import PhoneNumberModal from './components/PhoneNumberModal';
import LoadingScreen from '@/components/LoadingScreen';

export default function DashboardPage() {
  // --- State for the active tab ---
  const [activeTab, setActiveTab] = useState('Tech'); // Default to 'Tech'
  const [direction, setDirection] = useState(0);
  const tabs = ['Tech', 'Design', 'Management'];

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkPhoneNumber = async () => {
      if (status === 'loading') return;
      if (!session?.user?.email) return;

      try {
        const response = await fetch('/api/update-phone');
        const data = await response.json();

        if (data.success && !data.hasPhone) {
          setShowPhoneModal(true);
        }
      } catch (error) {
        console.error('Error checking phone number:', error);
      }
    };

    checkPhoneNumber();
  }, [session, status]);

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setIsSubmittingPhone(true);
    try {
      const response = await fetch('/api/update-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleTabChange = (tabName: string) => {
    const newIndex = tabs.indexOf(tabName);
    const oldIndex = tabs.indexOf(activeTab);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setActiveTab(tabName);
  };

  const ActionButton = (
    <Link href="/" passHref>
      <button className={styles.goToHomeButton}>Home</button>
    </Link>
  );

  return (
    <>
      {showPhoneModal && (
        <PhoneNumberModal
          onSubmit={handlePhoneSubmit}
          isSubmitting={isSubmittingPhone}
        />
      )}

      <PageLayout actionButton={ActionButton}>
        <UserGreeting />

        <DomainTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div className={styles.domainContentWrapper}>
          {activeTab === 'Tech' && <TechDomainContent />}
          {activeTab === 'Design' && <DesignDomainContent />}
          {activeTab === 'Management' && <ManagementDomainContent />}
        </div>
      </PageLayout>
    </>
  );
}