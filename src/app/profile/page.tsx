"use client";

import React from "react";
import { Khand } from "next/font/google";
import Image from "next/image";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { DomainCard } from "@/components/profile/DomainCard";
import { DecorativeCircles } from "@/components/profile/DecorativeCircles";
import { domains } from "@/data/domains";
import "../../styles/globals.css";

const khand = Khand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function ProfilePage() {
  return (
    <div className={khand.className}>
      <div className="page-wrapper">
        {/* Top Bar */}
        <div className="top-bar">
          <Image
            src="/assets/images/vinnovateit_white.svg"
            alt="VinnovateIT Logo"
            width={140}
            height={45}
            className="logo"
            priority
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
          <span className="timestamp">12:02 PM</span>
        </div>

        {/* Main Card */}
        <div className="main-card">
          <DecorativeCircles />

          <div className="card-content">
            <ProfileHeader
              name="Aditya"
              email="aditya.madan2024a@vitstudent.ac.in"
              registrationNumber="24BCE2370"
              phoneNumber="+91 9810270953"
            />

            <h2 className="applied-domains">Your Applied Domains</h2>

            <div className="domains-grid">
              {domains.map((domain, index) => (
                <DomainCard key={domain.title} domain={domain} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-wrapper {
          background: #000;
          min-height: 100vh;
          height: 100vh;
          padding: clamp(1rem, 3vw, 2rem);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: clamp(1rem, 3vw, 2rem);
          z-index: 0;
          position: relative;
          flex-shrink: 0;
          animation: fadeIn 0.6s ease-out;
        }

        .logo {
          width: clamp(100px, 20vw, 140px);
          height: auto;
          transition: transform 0.3s ease, opacity 0.3s ease;
          pointer-events: auto;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }

        .logo:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .timestamp {
          font-size: clamp(1rem, 2vw, 1.5rem);
          color: #fff;
          font-weight: 500;
          animation: slideInRight 0.6s ease-out;
        }

        .main-card {
          background: #fff;
          border-radius: clamp(20px, 4vw, 40px);
          padding: clamp(1.5rem, 4vw, 3rem);
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
          overflow: hidden;
          min-height: 0;
        }

        .applied-domains {
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          margin: 0 0 clamp(0.8rem, 2vw, 1.5rem) 0;
          font-weight: 500;
          color: #000;
          flex-shrink: 0;
          animation: fadeIn 1s ease-out 0.3s both;
        }

        .domains-grid {
          display: flex;
          gap: clamp(1rem, 2vw, 2rem);
          flex: 1;
          min-height: 0;
          overflow: hidden;
          flex-direction: row;
        }

        @media (max-width: 900px) {
          .domains-grid {
            flex-direction: column;
            overflow-y: auto;
            padding-right: 5px;
            scrollbar-width: thin;
            scrollbar-color: rgba(248, 104, 0, 0.5) rgba(255, 255, 255, 0.1);
          }

          /* Webkit (Chrome, Safari, Edge) scrollbar styling */
          .domains-grid::-webkit-scrollbar {
            width: 8px;
          }

          .domains-grid::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            margin: 10px 0;
          }

          .domains-grid::-webkit-scrollbar-thumb {
            background: rgba(248, 104, 0, 0.5);
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: padding-box;
            transition: background 0.3s ease;
          }

          .domains-grid::-webkit-scrollbar-thumb:hover {
            background: rgba(248, 104, 0, 0.7);
            background-clip: padding-box;
          }
        }
      `}</style>
    </div>
  );
}
