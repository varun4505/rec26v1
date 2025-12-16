// src/components/ConfirmModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      action();
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ''}`} 
      onClick={() => handleAction(onCancel)}
    >
      <div 
        className={`${styles.modal} ${isClosing ? styles.modalClosing : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton} 
            onClick={() => handleAction(onCancel)}
          >
            {cancelText}
          </button>
          <button 
            className={styles.confirmButton} 
            onClick={() => handleAction(onConfirm)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
