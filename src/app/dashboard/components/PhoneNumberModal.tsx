'use client';

import React, { useState } from 'react';
import styles from './PhoneNumberModal.module.css';

interface PhoneNumberModalProps {
  onSubmit: (phoneNumber: string) => void;
  isSubmitting?: boolean;
}

export default function PhoneNumberModal({ onSubmit, isSubmitting = false }: PhoneNumberModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const validatePhoneNumber = (phone: string): boolean => {
    // Indian phone number validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    onSubmit(phoneNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError('');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Welcome!</h2>
          <p className={styles.modalDescription}>
            Please provide your phone number to complete your profile
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.countryCode}>+91</span>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit number"
                  className={styles.input}
                  disabled={isSubmitting}
                  autoFocus
                  maxLength={10}
                />
              </div>
              {error && <span className={styles.errorText}>{error}</span>}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !phoneNumber}
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </button>
          </form>

          <p className={styles.privacyNote}>
            Your phone number will be kept confidential and used only for recruitment purposes
          </p>
        </div>
      </div>
    </div>
  );
}
