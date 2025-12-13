// src/app/dashboard/components/ManagementDomainContent.tsx
import React from 'react';
import Link from 'next/link';
import styles from '../Dashboard.module.css';
import SubdomainSelector from './SubdomainSelector';

export default function ManagementDomainContent() {
  const subtitleText = "Turning vision into motion.";
  const descriptionText = "Join our management team to organize events, handle marketing, and lead initiatives. Complete a comprehensive questionnaire (Round 1) to demonstrate your organizational and leadership skills.";

  return (
    <>
      {/* Use the SAME container and right-side styles */}
      <div className={styles.domainContentContainer}>
        {/* Use the NEW left-side styles */}
        <div className={styles.domainContentLeft}>
          <h2 className={styles.managementTitle}>Management</h2>
          <p className={styles.managementSubtitle}>{subtitleText}</p>
        </div>
        <div className={styles.domainContentRight}>
          <p className={styles.domainDescription}>{descriptionText}</p>
        </div>
      </div>
      <SubdomainSelector domain="management" />
    </>
  );
}
