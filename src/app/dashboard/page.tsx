"use client";

import React, { useState } from 'react';

import styles from './Dashboard.module.css';
import DashboardHeader from './components/DashboardHeader';
import UserGreeting from './components/UserGreeting';
import DomainTabs from './components/DomainTabs';
import SubdomainSelector from './components/SubdomainSelector';

import TechDomainContent from './components/TechDomainContent';
import DesignDomainContent from './components/DesignDomainContent';
import ManagementDomainContent from './components/ManagementDomainContent';

export default function DashboardPage() {
  // --- State for the active tab ---
  const [activeTab, setActiveTab] = useState('Tech'); // Default to 'Tech'

  // --- Handler function to change the tab ---
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className={styles.pageContainer}>
      <DashboardHeader />

      <main className={styles.mainContentArea}>
        <div className={styles.dashboardCard}>

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
  );
}
