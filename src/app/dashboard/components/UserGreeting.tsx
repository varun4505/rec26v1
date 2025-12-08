// src/app/dashboard/components/UserGreeting.tsx
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import styles from '../Dashboard.module.css';

export default function UserGreeting() {
  const { data: session } = useSession();
  
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  return (
    <div className={styles.userGreetingContainer}>
      <h1 className={styles.greetingTitle}>Hey {userName}</h1>
      <p className={styles.greetingEmail}>{userEmail}</p>
    </div>
  );
}
