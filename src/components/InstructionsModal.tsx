"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { MdNote, MdOutlineSearch } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";
import styles from "./InstructionsModal.module.css";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
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
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>

        <div className={styles.scrollContent}>
            <div className={styles.gridContainer}>
              
              {/* LEFT COLUMN: Guidelines */}
              <div className={styles.instructionSection}>
                <h3>Guidelines</h3>
                <ul>
                  <li>Perfect for freshers and sophomores looking to kickstart their innovation journey</li>
                  <li>Open to all branches - because great ideas know no boundaries</li>
                  <li>Choose your path: Technical, Management, or Design - where would you shine?</li>
                  <li>Show us your creativity and passion - perfection isn&apos;t required, enthusiasm is!</li>
                </ul>
                <hr className={styles.divider} />
                <p className={styles.footerNote}>
                  Take the first step into becoming part of the <strong>VinnovateIT family</strong> - where innovation never sleeps!
                </p>
              </div>

              {/* RIGHT COLUMN: Important & Insider Tip */}
              <div className={styles.rightColumn}>
                
                {/* Box 1: Important */}
                <div className={`${styles.highlightBox} ${styles.warningBox}`}>
                  <div className={styles.boxHeader}>
                        <PiWarningCircleFill size={22} style={{ color: '#f59e0b' }} />
                        <strong>Important</strong>
                  </div>
                  <p>
                    You can only fill this form once. Make sure all information is accurate before submitting.
                  </p>
                </div>
                  
                {/* Box 2: Insider Tip */}
                <div className={`${styles.highlightBox} ${styles.tipBox}`}>
                  <div className={styles.boxHeader}>
                        <MdOutlineSearch size={22} style={{ color: '#14b8a6' }} />
                        <strong>Insider Tip</strong>
                  </div>
                  <p>
                    Explore the website to discover hidden surprises that could help you in future interviews! The curious ones always find the treasures.
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}