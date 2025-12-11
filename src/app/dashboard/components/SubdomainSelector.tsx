// src/app/dashboard/components/SubdomainSelector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';
import { DOMAIN_CONFIG, type DomainType } from '@/data/domainConfig';
import ConfirmModal from '@/components/ConfirmModal';
import AlertModal from '@/components/AlertModal';

interface SubdomainSelectorProps {
  domain: DomainType;
}

export default function SubdomainSelector({ domain }: SubdomainSelectorProps) {
  const router = useRouter();
  const [selections, setSelections] = useState<any[]>([]);
  const [selectionCount, setSelectionCount] = useState(0);
  const [maxSelections, setMaxSelections] = useState(3);
  const [canModify, setCanModify] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const [alertModal, setAlertModal] = useState<{isOpen: boolean; title: string; message: string}>({
    isOpen: false,
    title: "",
    message: ""
  });

  const config = DOMAIN_CONFIG[domain];

  // Guard clause for invalid domain
  if (!config) {
    return (
      <div className={styles.subdomainContainer}>
        <p style={{ color: 'red' }}>Invalid domain: {domain}</p>
      </div>
    );
  }

  useEffect(() => {
    fetchSelections();
    fetchSubmissions();
  }, []);

  const fetchSelections = async () => {
    try {
      const response = await fetch('/api/selections');
      const data = await response.json();
      
      if (data.success) {
        setSelections(data.selections || []);
        setSelectionCount(data.selectionCount || 0);
        setMaxSelections(data.maxSelections || 3);
        setCanModify(data.canModifySelections !== false);
      }
    } catch (error) {
      console.error('Error fetching selections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      if (data.success) {
        setSubmissions(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const getSubmissionStatus = (subdomainSlug: string | null) => {
    const submission = submissions.find(
      (sub) =>
        sub.domain === domain &&
        sub.subdomain === subdomainSlug
    );
    return submission ? {
      round1Status: submission.round1Status,
      round2Status: submission.round2Status,
      canAccessRound2: submission.canAccessRound2
    } : null;
  };

  const isSelected = (subdomainSlug: string | null) => {
    return selections.some(
      (sel) =>
        sel.domain === domain &&
        (subdomainSlug ? sel.subdomain === subdomainSlug : sel.subdomain === null)
    );
  };

  const handleSelect = async (subdomainSlug: string | null) => {
    if (!canModify) {
      setAlertModal({
        isOpen: true,
        title: "VinnovateIT says",
        message: "Selection deadline has passed. Contact admin to make changes."
      });
      return;
    }

    const alreadySelected = isSelected(subdomainSlug);

    if (alreadySelected) {
      // Show confirmation modal
      setPendingRemoval(subdomainSlug);
      setShowConfirmModal(true);
    } else {
      // Add selection
      if (selectionCount >= maxSelections) {
        setAlertModal({
          isOpen: true,
          title: "VinnovateIT says",
          message: `Maximum ${maxSelections} selections allowed. Remove a selection first.`
        });
        return;
      }

      try {
        const response = await fetch('/api/selections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain,
            subdomain: subdomainSlug,
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          await fetchSelections();
        } else {
          setAlertModal({
            isOpen: true,
            title: "Error",
            message: data.error || 'Failed to add selection'
          });
        }
      } catch (error) {
        console.error('Error adding selection:', error);
        setAlertModal({
          isOpen: true,
          title: "Error",
          message: 'Failed to add selection'
        });
      }
    }
  };

  const handleConfirmRemoval = async () => {
    if (pendingRemoval === undefined) return;

    try {
      const params = new URLSearchParams({
        domain,
        subdomain: pendingRemoval || 'none',
      });
      
      const response = await fetch(`/api/selections?${params}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchSelections();
      } else {
        setAlertModal({
          isOpen: true,
          title: "Error",
          message: data.error || 'Failed to remove selection'
        });
      }
    } catch (error) {
      console.error('Error removing selection:', error);
      setAlertModal({
        isOpen: true,
        title: "Error",
        message: 'Failed to remove selection'
      });
    } finally {
      setShowConfirmModal(false);
      setPendingRemoval(null);
    }
  };

  const handleCancelRemoval = () => {
    setShowConfirmModal(false);
    setPendingRemoval(null);
  };

  const handleProceed = (subdomainSlug: string | null) => {
    if (!isSelected(subdomainSlug)) {
      setAlertModal({
        isOpen: true,
        title: "VinnovateIT says",
        message: 'Please select this domain/subdomain first'
      });
      return;
    }
    
    const subdomainParam = subdomainSlug || 'none';
    router.push(`/quiz/${config.slug}/${subdomainParam}/1`);
  };

  if (loading) {
    return (
      <div className={styles.subdomainContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  // For Management (no subdomains)
  if (!config.hasSubdomains) {
    const selected = isSelected(null);
    
    return (
      <div className={styles.subdomainContainer}>
        <h3 className={styles.subdomainTitle}>
          Start Your Assessment ({selectionCount} / {maxSelections} selections)
          {!canModify && <span style={{ color: 'red', marginLeft: '10px' }}>⚠️ Deadline Passed</span>}
        </h3>
        <div className={styles.subdomainBoxes}>
          <div 
            className={`${styles.subdomainBox} ${selected ? styles.selected : ''}`}
            onClick={() => !selected && handleSelect(null)}
            style={{ 
              cursor: canModify || selected ? 'pointer' : 'not-allowed',
              position: 'relative'
            }}
          >
            <span>{selected ? '✓ Management Selected' : 'Select Management'}</span>
            {selected && (() => {
              const status = getSubmissionStatus(null);
              const round1Status = status?.round1Status || 'Pending';
              const canAccessRound2 = status?.canAccessRound2 || false;
              const round2Status = status?.round2Status;

              return (
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                  {round1Status === 'Pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProceed(null);
                      }}
                      className={styles.proceedButton}
                    >
                      Start Round 1 →
                    </button>
                  )}
                  {round1Status !== 'Pending' && (
                    <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexDirection: 'column' }}>
                      <div 
                        style={{ 
                          fontSize: '13px', 
                          color: '#555',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <strong>Round 1:</strong> {round1Status}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProceed(null);
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#f86800'
                          }}
                          aria-label="Edit Round 1"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </button>
                      </div>
                      {canAccessRound2 && round2Status && (
                        <>
                          <div style={{ fontSize: '13px', color: '#555' }}>
                            <strong>Round 2:</strong> {round2Status}
                          </div>
                          {round2Status === 'Pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/quiz/${config.slug}/none/round2`);
                              }}
                              className={styles.proceedButton}
                            >
                              Start Round 2 →
                            </button>
                          )}
                          {round2Status !== 'Pending' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/quiz/${config.slug}/none/round2`);
                              }}
                              className={styles.proceedButton}
                            >
                              Edit Round 2 →
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  {canModify && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(null);
                      }}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  // For Tech and Design (with subdomains)
  return (
    <div className={styles.subdomainContainer}>
      <h3 className={styles.subdomainTitle}>
        Choose subdomains ({selectionCount} / {maxSelections} total)
        {!canModify && <span style={{ color: 'red', marginLeft: '10px' }}>⚠️ Deadline Passed</span>}
      </h3>
      <div className={styles.subdomainBoxes}>
        {config.subdomains.map((subdomain) => {
          const selected = isSelected(subdomain.slug);
          
          return (
            <div
              key={subdomain.id}
              className={`${styles.subdomainBox} ${selected ? styles.selected : ''}`}
              onClick={() => !selected && handleSelect(subdomain.slug)}
              style={{ 
                cursor: (canModify || selected) ? 'pointer' : 'not-allowed',
                position: 'relative'
              }}
            >
              <span style={{ marginBottom: selected ? '8px' : '0' }}>{subdomain.name}</span>
              {selected ? (() => {
                const status = getSubmissionStatus(subdomain.slug);
                const round1Status = status?.round1Status || 'Pending';
                const canAccessRound2 = status?.canAccessRound2 || false;
                const round2Status = status?.round2Status;

                return (
                  <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexDirection: 'column', width: '100%' }}>
                    {round1Status === 'Pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProceed(subdomain.slug);
                        }}
                        className={styles.proceedButton}
                      >
                        Start Round 1 →
                      </button>
                    )}
                    {round1Status !== 'Pending' && (
                      <>
                        <div 
                          style={{ 
                            fontSize: '13px', 
                            color: '#555', 
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <strong>Round 1:</strong> {round1Status}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProceed(subdomain.slug);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#f86800'
                            }}
                            aria-label="Edit Round 1"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </button>
                        </div>
                        {canAccessRound2 && round2Status && (
                          <>
                            <div style={{ fontSize: '13px', color: '#555', textAlign: 'left' }}>
                              <strong>Round 2:</strong> {round2Status}
                            </div>
                            {round2Status === 'Pending' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/quiz/${config.slug}/${subdomain.slug}/round2`);
                                }}
                                className={styles.proceedButton}
                              >
                                Start Round 2 →
                              </button>
                            )}
                            {round2Status !== 'Pending' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/quiz/${config.slug}/${subdomain.slug}/round2`);
                                }}
                                className={styles.proceedButton}
                              >
                                Edit Round 2 →
                              </button>
                            )}
                          </>
                        )}
                      </>
                    )}
                    {canModify && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(subdomain.slug);
                        }}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })() : (
                <p style={{ marginTop: '4px', opacity: 0.6, fontSize: '14px' }}>
                  Click to select
                </p>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Remove Selection"
        message="Are you sure you want to remove this selection? This action cannot be undone."
        onConfirm={handleConfirmRemoval}
        onCancel={handleCancelRemoval}
        confirmText="Remove"
        cancelText="Cancel"
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() => setAlertModal({isOpen: false, title: "", message: ""})}
      />
    </div>
  );
}
