// src/app/dashboard/components/DesignDomainContent.tsx
import React from 'react';
import styles from '../Dashboard.module.css';
import SubdomainSelector from './SubdomainSelector';

export default function DesignDomainContent() {
  const subtitleText = "Crafting experiences that speak for themselves.";
  const descriptionText = "Join our design team to create stunning visuals and user experiences. Choose from UI/UX, Graphic Design, or Video Editing. Submit your creative task (Round 1) to showcase your design skills and portfolio.";

  return (
    <>
      {/* We still use the generic container and right-side styles */}
      <div className={styles.domainContentContainer}>
        
        {/* --- Use the NEW Design-specific styles --- */}
        <div className={styles.domainContentLeft}>
          <h2 className={styles.designTitle}>Design</h2>
          <p className={styles.designSubtitle}>{subtitleText}</p>
        </div>

        <div className={styles.domainContentRight}>
          <p className={styles.domainDescription}>{descriptionText}</p>
        </div>
      </div>
      <SubdomainSelector domain="design" />
    </>
  );
}
