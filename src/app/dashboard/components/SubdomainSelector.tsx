// src/app/dashboard/components/SubdomainSelector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, X, Edit2 } from 'lucide-react';
import styles from '../Dashboard.module.css';
import { DOMAIN_CONFIG, type DomainType, getSubdomainInfo, getDiscordLink } from '@/data/domainConfig';
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
        <div className="flex w-full items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8F6B]"></div>
        </div>
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
              }}
            >
              {/* Header: Name */}
              <div className={styles.boxHeader}>
                <span className={styles.boxTitle}>{item.name}</span>
                {selected && (
                  <span className={styles.selectionIndicator}>Selected</span>
                )}
              </div>

              {/* Body: Status & Actions */}
              {selected ? (() => {
                const status = getSubmissionStatus(itemSlug);
                const round1Status = status?.round1Status || 'Pending';
                const canAccessRound2 = status?.canAccessRound2 || false;
                const round2Status = status?.round2Status;
                const isRejected = round1Status === 'Not Passed' || round2Status === 'Not Passed';

                if (isRejected) {
                  return (
                    <div className={styles.rejectedMessage}>
                      <strong>Nice try!</strong>
                      <p>You didn&apos;t make it this time, but keep building!</p>
                    </div>
                  );
                }

                return (
                  <div className={styles.boxContent}>
                    {round1Status === 'Pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProceed(itemSlug);
                        }}
                        className={styles.proceedButton}
                      >
                        Start Round 1 <ArrowRight size={16} />
                      </button>
                    )}
                    
                    {round1Status !== 'Pending' && (
                      <>
                        <div className={styles.statusRow}>
                          <span className={styles.statusLabel}>Round 1:</span>
                          <span className={styles.statusValue}>{round1Status}</span>
                          {round1Status !== 'Passed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProceed(itemSlug);
                              }}
                              className={styles.iconButton}
                              title="Edit Round 1"
                            >
                               <Edit2 size={14} />
                            </button>
                          )}
                        </div>
                        {/* Check for Single Round (Combined) domains */}
                        {isSingleRound && round1Status === 'Passed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const discordLink = getDiscordLink(domain, itemSlug);
                              if (discordLink) window.open(discordLink, '_blank');
                            }}
                            className={styles.proceedButton}
                          >
                            Join Whatsapp group for Interview <ArrowRight size={16} />
                          </button>
                        )}
                        {/* Round 2 Logic for multi-round domains */}
                        {!isSingleRound && canAccessRound2 && round2Status && (
                          <>
                            <div className={styles.statusRow}>
                              <span className={styles.statusLabel}>Round 2:</span>
                              <span className={styles.statusValue}>{round2Status}</span>
                            </div>
                            
                            {(round2Status === 'Pending') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/quiz/${config.slug}/${itemSlug || 'none'}/round2`);
                                }}
                                className={styles.proceedButton}
                              >
                                Start Round 2 <ArrowRight size={16} />
                              </button>
                            )}

                             {round2Status === 'Passed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const discordLink = getDiscordLink(domain, itemSlug);
                                  if (discordLink) window.open(discordLink, '_blank');
                                }}
                                className={styles.proceedButton}
                              >
                                Join Whatsapp group for Interview <ArrowRight size={16} />
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
                                Edit Round 2 <ArrowRight size={16} />
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
                         <X size={14} style={{ marginRight: '4px' }} /> Remove
                      </button>
                    )}
                  </div>
                );
              })() : (
                <div className={styles.placeholderContent}>
                  <p>Click to select</p>
                </div>
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
