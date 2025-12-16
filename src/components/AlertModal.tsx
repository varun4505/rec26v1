// src/components/AlertModal.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300); // Match animation duration
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ''}`} 
      onClick={handleClose}
    >
      <div 
        className={`${styles.modal} ${isClosing ? styles.modalClosing : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.okButton} onClick={handleClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
