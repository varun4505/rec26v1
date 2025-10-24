// src/app/profile/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Khand } from "next/font/google";
import Image from "next/image";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ApplicationCard } from "@/components/profile/DomainCard";
import { DecorativeCircles } from "@/components/profile/DecorativeCircles";
import { MobileRestriction } from "@/components/MobileRestriction";
import { EmptyState } from "@/components/profile/EmptyState";
import { applications } from "@/data/domains";
import "@/styles/globals.css";

const khand = Khand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function ProfilePage() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [showFade, setShowFade] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const userName = "Aditya";
  const userInitial = userName.charAt(0).toUpperCase();
  const hasApplications = applications.length > 0;

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
            <div className="avatar-monogram">{userInitial}</div>
            <span className="timestamp">{currentTime}</span>
          </div>
        </div>

        <div className="main-card">
          <DecorativeCircles />

          <div className="card-content">
            <ProfileHeader
              name={userName}
              email="aditya.madan2024a@vitstudent.ac.in"
              registrationNumber="24BCE2370"
              phoneNumber="+91 9810270953"
            />

            <h2 className="applied-heading">Your Applications</h2>

            {hasApplications ? (
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
      `}</style>
    </div>
  );
}
