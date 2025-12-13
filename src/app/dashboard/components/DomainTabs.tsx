// src/app/dashboard/components/DomainTabs.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styles from '../Dashboard.module.css';

// --- Define props type ---
interface DomainTabsProps {
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

export default function DomainTabs({ activeTab, onTabChange }: DomainTabsProps) {
  const tabs = ['Tech', 'Design', 'Management'];

  return (
    <div className={styles.domainTabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="activeTabIndicator"
              className={styles.activeTabIndicator}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span>{tab}</span>
        </button>
      ))}
    </div>
  );
}
