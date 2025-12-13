// src/app/dashboard/components/TechDomainContent.tsx
import React from 'react';
import styles from '../Dashboard.module.css';
import SubdomainSelector from './SubdomainSelector';

export default function TechDomainContent() {
  const descriptionText = "Join our technical team and work on cutting-edge projects. Choose from Web Development, App Development, AI/ML, Competitive Coding, or Cyber Security. Complete Round 1 questionnaire and Round 2 task submission to showcase your skills.";

  return (
    <>
      <div className={styles.domainContentContainer}>
        <div className={styles.domainContentLeft}>
          <h2 className={styles.techTitle}>TECH</h2>
          <p className={styles.techSubtitle}>Building smarter ways to create.</p>
        </div>
        <div className={styles.domainContentRight}>
          <p className={styles.domainDescription}>{descriptionText}</p>
        </div>
      </div>
      <SubdomainSelector domain="technical" />
    </>
  );
}
