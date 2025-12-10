// src/app/dashboard/components/SubdomainSelector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../Dashboard.module.css';
import { DOMAIN_CONFIG, type DomainType } from '@/data/domainConfig';

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

  const isSelected = (subdomainSlug: string | null) => {
    return selections.some(
      (sel) =>
        sel.domain === domain &&
        (subdomainSlug ? sel.subdomain === subdomainSlug : sel.subdomain === null)
    );
  };

  const handleSelect = async (subdomainSlug: string | null) => {
    if (!canModify) {
      alert('Selection deadline has passed. Contact admin to make changes.');
      return;
    }

    const alreadySelected = isSelected(subdomainSlug);

    if (alreadySelected) {
      // Remove selection
      const confirmed = confirm('Remove this selection?');
      if (!confirmed) return;

      try {
        const params = new URLSearchParams({
          domain,
          subdomain: subdomainSlug || 'none',
        });
        
        const response = await fetch(`/api/selections?${params}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          await fetchSelections();
        } else {
          alert(data.error || 'Failed to remove selection');
        }
      } catch (error) {
        console.error('Error removing selection:', error);
        alert('Failed to remove selection');
      }
    } else {
      // Add selection
      if (selectionCount >= maxSelections) {
        alert(`Maximum ${maxSelections} selections allowed. Remove a selection first.`);
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
          alert(data.error || 'Failed to add selection');
        }
      } catch (error) {
        console.error('Error adding selection:', error);
        alert('Failed to add selection');
      }
    }
  };

  const handleProceed = (subdomainSlug: string | null) => {
    if (!isSelected(subdomainSlug)) {
      alert('Please select this domain/subdomain first');
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
            {selected && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProceed(null);
                  }}
                  className={styles.proceedButton}
                >
                  Start Round 1 →
                </button>
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
            )}
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
              {selected ? (
                <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexDirection: 'column', width: '100%' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceed(subdomain.slug);
                    }}
                    className={styles.proceedButton}
                  >
                    Start Round 1 →
                  </button>
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
              ) : (
                <p style={{ marginTop: '4px', opacity: 0.6, fontSize: '14px' }}>
                  Click to select
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
