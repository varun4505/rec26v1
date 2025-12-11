// src/app/dashboard/components/UserGreeting.tsx
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import styles from '../Dashboard.module.css';

export default function UserGreeting() {
  const { data: session } = useSession();

  const rawName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  const userName = rawName.replace(/\b(21|22|23|24|25|26)[A-Za-z0-9]*$/, "").trim();

  return (
    <div className={styles.userGreetingContainer}>
      <h1 className={styles.greetingTitle}>Hey {userName}</h1>
      <p className={styles.greetingEmail}>{userEmail}</p>
    </div>
  );
}
