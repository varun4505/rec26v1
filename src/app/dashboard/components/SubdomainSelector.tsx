// src/app/dashboard/components/SubdomainSelector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';
import { DOMAIN_CONFIG, type DomainType, getSubdomainInfo } from '@/data/domainConfig';
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
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: ""
  });

  const config = DOMAIN_CONFIG[domain];

  useEffect(() => {
    if (config) {
      fetchSelections();
      fetchSubmissions();
    }
  }, [domain]);

  const fetchSelections = async () => {
    try {
      const response = await fetch('/api/selections', { cache: 'no-store' });
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
      const response = await fetch('/api/profile', { cache: 'no-store' });
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  // Guard clause for invalid domain - MUST be after all hooks
  if (!config) {
    return (
      <div className={styles.subdomainContainer}>
        <p style={{ color: 'red' }}>Invalid domain: {domain}</p>
      </div>
    );
  }

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

  // Determine items to render (subdomains or the domain itself)
  const selectableItems = config.hasSubdomains
    ? config.subdomains
    : [{ id: 'main', name: config.name, slug: null }];

  return (
    <div className={styles.subdomainContainer}>
      <h3 className={styles.subdomainTitle}>
        {config.hasSubdomains ? 'Choose subdomains' : 'Start Your Assessment'} ({selectionCount} / {maxSelections} {config.hasSubdomains ? 'total' : 'selections'})
        {!canModify && <span style={{ color: 'red', marginLeft: '10px' }}>⚠️ Deadline Passed</span>}
      </h3>
      <div className={styles.subdomainBoxes}>
        {selectableItems.map((item) => {
          // Handle slug: explicit null for main domain, string for subdomains
          const itemSlug = (item as any).slug;
          const selected = isSelected(itemSlug);

          // Determine rounds for this specific item
          const subdomainInfo = itemSlug ? getSubdomainInfo(domain, itemSlug) : null;
          const rounds = subdomainInfo?.rounds || config.rounds;
          const isSingleRound = rounds.length === 1;

          return (
            <div
              key={item.id}
              className={`${styles.subdomainBox} ${selected ? styles.selected : ''}`}
              onClick={() => !selected && handleSelect(itemSlug)}
              style={{
                cursor: (canModify || selected) ? 'pointer' : 'not-allowed',
                position: 'relative'
              }}
            >
              <span style={{ marginBottom: selected ? '8px' : '0' }}>{item.name}</span>
              {selected ? (() => {
                const status = getSubmissionStatus(itemSlug);
                const round1Status = status?.round1Status || 'Pending';
                const canAccessRound2 = status?.canAccessRound2 || false;
                const round2Status = status?.round2Status;
                const isRejected = round1Status === 'Not Passed' || round2Status === 'Not Passed';

                if (isRejected) {
                  return (
                    <div style={{ marginTop: '6px', display: 'flex', gap: '8px', flexDirection: 'column', width: '100%' }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#000',
                        textAlign: 'left',
                        lineHeight: '1.4'
                      }}>
                        Hey, thanks for giving the recruitment your best shot.
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#333',
                        textAlign: 'left',
                        lineHeight: '1.5'
                      }}>
                        You didn't make it to the next round this time, but your effort didn't go unnoticed.
                        Keep learning, keep building — we'd love to see you apply again soon.
                      </div>
                    </div>
                  );
                }

                return (
                  <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexDirection: 'column', width: '100%' }}>
                    {round1Status === 'Pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProceed(itemSlug);
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
                              handleProceed(itemSlug);
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
                        {/* Check for Single Round (Combined) domains */}
                        {isSingleRound && round1Status === 'Passed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Logic for scheduling interview
                              alert("Redirecting to interview scheduler...");
                            }}
                            className={styles.proceedButton}
                            style={{ marginTop: '4px' }}
                          >
                            Schedule Interview →
                          </button>
                        )}
                        {/* Round 2 Logic for multi-round domains */}
                        {!isSingleRound && canAccessRound2 && round2Status && (
                          <>
                            <div style={{ fontSize: '13px', color: '#555', textAlign: 'left' }}>
                              <strong>Round 2:</strong> {round2Status}
                            </div>
                            {round2Status === 'Pending' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/quiz/${config.slug}/${itemSlug || 'none'}/round2`);
                                }}
                                className={styles.proceedButton}
                              >
                                Start Round 2 →
                              </button>
                            )}
                            {round2Status === 'Passed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Logic for scheduling interview
                                  alert("Redirecting to interview scheduler...");
                                }}
                                className={styles.proceedButton}
                              >
                                Schedule Interview →
                              </button>
                            )}
                            {round2Status !== 'Pending' && round2Status !== 'Passed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/quiz/${config.slug}/${itemSlug || 'none'}/round2`);
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
                    {canModify && round1Status !== 'Passed' && round2Status !== 'Passed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(itemSlug);
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
        message="Are you sure you want to remove this selection? All your responses and submissions for this domain will be permanently deleted. This action cannot be undone."
        onConfirm={handleConfirmRemoval}
        onCancel={handleCancelRemoval}
        confirmText="Remove"
        cancelText="Cancel"
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() => setAlertModal({ isOpen: false, title: "", message: "" })}
      />
    </div>
  );
}
