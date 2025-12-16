"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PageLayout from "@/components/PageLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ApplicationCard } from "@/components/profile/DomainCard";
import { DecorativeCircles } from "@/components/profile/DecorativeCircles";
import { EmptyState } from "@/components/profile/EmptyState";

interface UserApplication {
  domain: string;
  subdomain: string | null;
  round1Status: string;
  round2Status: string | null;
  canAccessRound2: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [showFade, setShowFade] = useState(false);
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenApplications, setHiddenApplications] = useState<Set<string>>(new Set());
  
  const rawName = session?.user?.name || "User";
  const userName = rawName.replace(/\b(21|22|23|24|25|26)[A-Za-z0-9]*$/, "").trim();
  const userEmail = session?.user?.email || "";

  const visibleApplications = applications.filter(app => {
    const key = `${app.domain}-${app.subdomain || 'none'}`;
    return !hiddenApplications.has(key);
  });
  const hasApplications = visibleApplications.length > 0;

  // Extract registration number from user's name (format: "Varun B 23MID0026")
  const extractRegistrationNumber = (userName: string): string => {
    if (!userName) return "";
    // Extract registration number pattern from the user name (e.g., 23MID0026)
    const match = userName.match(/([0-9]{2}[A-Z]{3}[0-9]{4})/);
    return match ? match[1] : "";
  };

  const registrationNumber = extractRegistrationNumber(session?.user?.name || "");

  // Load hidden applications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hiddenApplications');
    if (stored) {
      try {
        setHiddenApplications(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error('Error parsing hidden applications:', e);
      }
    }
  }, []);

  // Handle hiding an application
  const handleHideApplication = (domain: string, subdomain: string | null) => {
    const key = `${domain}-${subdomain || 'none'}`;
    const newHidden = new Set(hiddenApplications);
    newHidden.add(key);
    setHiddenApplications(newHidden);
    localStorage.setItem('hiddenApplications', JSON.stringify([...newHidden]));
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplications();
    } else if (status === "loading") {
      // Still loading session
      setLoading(true);
    } else {
      // Not authenticated
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && status === "authenticated") {
        console.log("Page became visible, refetching applications...");
        fetchApplications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [status]);

  const fetchApplications = async () => {
    try {
      // Add cache-busting parameter and no-cache headers
      const response = await fetch(`/api/profile?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      console.log("API response status:", response.status);

      const data = await response.json();
      console.log("Profile API response:", data);

      if (data.success) {
        setApplications(data.applications || []);
        console.log("Applications set:", data.applications);
      } else {
        console.error("API returned success: false", data);
        console.error("Error from API:", data.error);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const ActionButton = (
    <a href="/dashboard" style={{
      backgroundColor: '#FFFFFF',
      color: '#000000',
      border: 'none',
      padding: '8px 20px',
      borderRadius: '13px',
      fontFamily: 'var(--font-khand)',
      fontSize: '15px',
      fontWeight: '400',
      cursor: 'pointer',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      display: 'inline-block'
    }}>
      Dashboard
    </a>
  );

  return (
    <PageLayout actionButton={ActionButton}>
      <DecorativeCircles />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <ProfileHeader
          name={userName}
          email={userEmail}
          registrationNumber={registrationNumber}
        />

        <h2 style={{
          fontSize: 'clamp(1.08rem, 2.7vw, 1.62rem)',
          margin: '0 0 clamp(0.9rem, 1.8vw, 1.35rem) 0',
          fontWeight: 500,
          color: '#000',
          flexShrink: 0,
          animation: 'fadeIn 1s ease-out 0.3s both'
        }}>Your Applications</h2>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            color: '#666'
          }}>
            Loading your applications...
          </div>
        ) : hasApplications ? (
          <div className="applications-container" style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div
              className={`applications-grid ${showFade ? "with-fade" : ""}`}
              style={{
                display: 'flex',
                gap: 'clamp(1.08rem, 1.8vw, 1.8rem)',
                flex: 1,
                minHeight: 0,
                maxHeight: '100%',
                overflowX: 'auto',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                alignItems: 'stretch',
                padding: '0 1.35rem 0.5rem 1.35rem',
                margin: '0 -1.35rem',
                flexWrap: 'wrap',
                justifyContent: 'flex-start'
              }}
            >
              {visibleApplications.map((application, index) => (
                <ApplicationCard
                  key={index}
                  application={application}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .applications-grid::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </PageLayout>
  );
}