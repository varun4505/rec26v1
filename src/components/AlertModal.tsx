// src/components/AlertModal.tsx
"use client";

import React from "react";
import styles from "./AlertModal.module.css";

interface AlertModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
}

export default function AlertModal({
  isOpen,
  title,
  message,
  onClose,
  buttonText = "OK",
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.okButton} onClick={onClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
