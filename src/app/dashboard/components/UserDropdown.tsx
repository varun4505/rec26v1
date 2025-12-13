// src/app/dashboard/components/UserDropdown.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import styles from '../Dashboard.module.css';

export default function UserDropdown() {
  
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className={styles.userDropdownMenu}>
      <Link href="/profile" passHref>
        <span className={styles.dropdownLink}>View Profile</span>
      </Link>
      <button onClick={handleLogout} className={styles.dropdownLink}>
        Logout
      </button>
    </div>
  );
}
