// src/app/profile/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Khand } from "next/font/google";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ApplicationCard } from "@/components/profile/DomainCard";
import { DecorativeCircles } from "@/components/profile/DecorativeCircles";
import { MobileRestriction } from "@/components/MobileRestriction";
import { EmptyState } from "@/components/profile/EmptyState";

const khand = Khand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

interface Selection {
  id: string;
  domain: string;
  subdomain: string | null;
  selectedAt: string;
}

interface Submission {
  id: string;
  domain: string;
  subdomain: string | null;
  round: string;
  submissionUrl: string | null;
  isPassed: boolean | null;
  feedback: string | null;
  submittedAt: string;
}

interface UserApplication {
  domain: string;
  subdomain: string | null;
  round1Status: string;
  round1Feedback: string | null;
  round2Status: string | null;
  round2Feedback: string | null;
  canAccessRound2: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showFade, setShowFade] = useState(false);
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);
  const rawName = session?.user?.name || "User";
  const userName = rawName.replace(/\b(21|22|23|24|25|26)[A-Za-z0-9]*$/, "").trim();

  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();
  const hasApplications = applications.length > 0;

  // Extract registration number from user's name (format: "Varun B 23MID0026")
  const extractRegistrationNumber = (userName: string): string => {
    if (!userName) return "";
    // Extract registration number pattern from the user name (e.g., 23MID0026)
    const match = userName.match(/([0-9]{2}[A-Z]{3}[0-9]{4})/);
    return match ? match[1] : "";
  };

  const registrationNumber = extractRegistrationNumber(session?.user?.name || "");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");
      setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/profile');
      console.log('API response status:', response.status);

      const data = await response.json();
      console.log('Profile API response:', data);

      if (data.success) {
        setApplications(data.applications || []);
        console.log('Applications set:', data.applications);
      } else {
        console.error('API returned success: false', data);
        console.error('Error from API:', data.error);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      if (gridRef.current) {
        const { scrollWidth, clientWidth } = gridRef.current;
        setShowFade(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    return () => window.removeEventListener("resize", checkScroll);
  }, [hasApplications]);

  return (
    <div className={khand.className}>
      {/* Mobile Restriction - Only shows on mobile */}
      <MobileRestriction />

      {/* Desktop View */}
      <div className="page-wrapper">
        <div className="top-bar">
          <Image
            src="/assets/images/vinnovateit_white.svg"
            alt="VinnovateIT Logo"
            width={113}
            height={36}
            className="logo"
            priority
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />

          <div className="right-section">
            <a href="/dashboard" className="dashboard-button">
              Back to Dashboard
            </a>
            <div className="avatar-monogram" style={{ overflow: 'hidden' }}>
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={34}
                  height={34}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                userInitial
              )}
            </div>
            <span className="timestamp">{currentTime}</span>
          </div>
        </div>

        <div className="main-card">
          <DecorativeCircles />

          <div className="card-content">
            <ProfileHeader
              name={userName}
              email={userEmail}
              registrationNumber={registrationNumber}
            />

            <h2 className="applied-heading">Your Applications</h2>

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
              <div className="applications-container">
                <div
                  className={`applications-grid ${showFade ? "with-fade" : ""}`}
                  ref={gridRef}
                >
                  {applications.map((application, index) => (
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
        </div>
      </div>

      <style jsx>{`
        .page-wrapper {
          background: #000;
          min-height: 100vh;
          height: 100vh;
          padding: clamp(0.9rem, 2.7vw, 1.8rem);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (max-width: 900px) {
          .page-wrapper {
            display: none;
          }
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: clamp(0.9rem, 2.7vw, 1.8rem);
          z-index: 0;
          position: relative;
          flex-shrink: 0;
          animation: fadeIn 0.6s ease-out;
        }
        .logo {
          width: clamp(81px, 16.2vw, 113px);
          height: auto;
          transition: transform 0.3s ease, opacity 0.3s ease;
          -webkit-user-drag: none;
          user-drag: none;
        }
        .logo:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }
        .right-section {
          display: flex;
          align-items: center;
          gap: clamp(0.72rem, 1.8vw, 1.08rem);
          animation: slideInRight 0.6s ease-out;
        }
        .dashboard-button {
          background-color: #FFFFFF;
          color: #000000;
          border: none;
          padding: 8px 20px;
          border-radius: 13px;
          font-family: var(--font-khand);
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
          display: inline-block;
        }
        .dashboard-button:hover {
          background-color: #f0f0f0;
        }
        .avatar-monogram {
          width: clamp(28px, 4.8vw, 34px);
          height: clamp(28px, 4.8vw, 34px);
          border-radius: 50%;
          background: linear-gradient(135deg, #ff8c42 0%, #f86800 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(0.8rem, 2.2vw, 1rem);
          font-weight: 600;
          color: #fff;
          box-shadow: 0 4px 12px rgba(248, 104, 0, 0.4);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .avatar-monogram:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(248, 104, 0, 0.5);
        }
        .timestamp {
          font-size: clamp(0.81rem, 1.62vw, 1.22rem);
          color: #fff;
          font-weight: 500;
        }
        .main-card {
          background: #fff;
          border-radius: clamp(18px, 3.6vw, 36px);
          padding: clamp(1.22rem, 3.24vw, 2.43rem);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
          min-height: 0;
          position: relative;
          animation: fadeInUp 0.8s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .card-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        .applied-heading {
          font-size: clamp(1.08rem, 2.7vw, 1.62rem);
          margin: 0 0 clamp(0.9rem, 1.8vw, 1.35rem) 0;
          font-weight: 500;
          color: #000;
          flex-shrink: 0;
          animation: fadeIn 1s ease-out 0.3s both;
        }
        .applications-container {
          position: relative;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .applications-grid {
          display: flex;
          gap: clamp(1.08rem, 1.8vw, 1.8rem);
          flex: 1;
          min-height: 0;
          max-height: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          align-items: stretch;
          padding: 0 1.35rem 0.5rem 1.35rem;
          margin: 0 -1.35rem;
        }
        .applications-grid.with-fade {
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 2%,
            black 98%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 2%,
            black 98%,
            transparent 100%
          );
        }
        .applications-grid::-webkit-scrollbar {
          display: none;
        }

        /* Responsive Styles for Smaller Laptops */
        @media (max-width: 1400px) {
          .main-card {
            padding: clamp(1rem, 2.5vw, 2rem);
          }

          .applications-grid {
            gap: clamp(0.9rem, 1.5vw, 1.5rem);
            padding: 0 1rem 0.5rem 1rem;
            margin: 0 -1rem;
          }
        }

        @media (max-width: 1200px) {
          .page-wrapper {
            padding: clamp(0.8rem, 2vw, 1.2rem);
          }

          .main-card {
            padding: clamp(0.9rem, 2vw, 1.5rem);
          }

          .logo {
            width: clamp(70px, 14vw, 100px);
          }

          .dashboard-button {
            padding: 7px 16px;
            font-size: 14px;
          }

          .applied-heading {
            font-size: clamp(0.95rem, 2.2vw, 1.3rem);
          }

          .applications-grid {
            gap: clamp(0.8rem, 1.2vw, 1.2rem);
          }
        }
      `}</style>
    </div>
  );
}
