"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";

export const MobileRestriction: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const { data: session } = useSession();
  const userLabel = (session?.user?.email || session?.user?.name || "User").trim();
  const userInitial = (userLabel[0] || "U").toUpperCase();
  const userImage = session?.user?.image || "";

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

  return (
    <>
      <div className="mobile-restriction">
        <div className="mobile-page-wrapper">
          {/* Top Bar */}
          <div className="mobile-top-bar">
            <Image
              src="/assets/images/vinnovateit_white.svg"
              alt="VinnovateIT Logo"
              width={113}
              height={36}
              className="mobile-logo"
              priority
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />

            <div className="mobile-right-section">
              {userImage ? (
                <div className="mobile-avatar-wrapper" aria-label={userLabel}>
                  <Image
                    src={userImage}
                    alt={userLabel}
                    fill
                    sizes="34px"
                    className="mobile-avatar-image"
                  />
                </div>
              ) : (
                <div className="mobile-avatar-monogram">{userInitial}</div>
              )}
              <span className="mobile-timestamp">{currentTime}</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="mobile-main-card">
            {/* Decorative Circles */}
            <div className="mobile-circle-top-right"></div>
            <div className="mobile-circle-bottom-right"></div>
            <div className="mobile-circle-left-middle"></div>

            <div className="mobile-card-content">
              <div className="icon-container">
                <MdOutlinePhoneIphone className="phone-icon" />
                <IoArrowForward className="arrow-icon" />
                <HiOutlineDesktopComputer className="desktop-icon" />
              </div>
              <h2>Desktop View Required</h2>
              <p>
                For the best experience, please access this page from a desktop
                or laptop computer.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mobile-restriction {
          display: none;
        }

        @media (max-width: 900px) {
          .mobile-restriction {
            display: flex;
            background: #000;
            min-height: 100vh;
            padding: clamp(1rem, 3vw, 2rem);
            box-sizing: border-box;
          }

          .mobile-page-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: clamp(1rem, 3vw, 2rem);
          }

          .mobile-top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 0;
            position: relative;
            flex-shrink: 0;
          }

          .mobile-logo {
            width: clamp(81px, 16.2vw, 113px);
            height: auto;
            -webkit-user-drag: none;
            user-drag: none;
          }

          .mobile-right-section {
            display: flex;
            align-items: center;
            gap: clamp(0.72rem, 1.8vw, 1.08rem);
          }

          .mobile-avatar-monogram {
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
          }

          .mobile-avatar-image {
            object-fit: cover;
          }

          .mobile-avatar-wrapper {
            width: clamp(28px, 4.8vw, 34px);
            height: clamp(28px, 4.8vw, 34px);
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            box-shadow: 0 4px 12px rgba(248, 104, 0, 0.4);
          }

          .mobile-timestamp {
            font-size: clamp(0.81rem, 1.62vw, 1.22rem);
            color: #fff;
            font-weight: 500;
          }

          .mobile-main-card {
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
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          /* Decorative Circles */
          .mobile-circle-top-right {
            position: absolute;
            top: -150px;
            right: -150px;
            width: 500px;
            height: 500px;
            background: rgba(14, 50, 74, 0.25);
            box-shadow: 0 0 200px 100px rgba(14, 50, 74, 0.2);
            border-radius: 9999px;
            filter: blur(120px);
            pointer-events: none;
            z-index: 0;
            opacity: 0.25;
            animation: pulse 6s ease-in-out infinite;
          }
          .mobile-circle-bottom-right {
            position: absolute;
            bottom: -150px;
            right: clamp(1rem, 3vw, 2rem);
            width: 500px;
            height: 500px;
            background: rgba(246, 0, 21, 0.25);
            box-shadow: 0 0 200px 100px rgba(246, 0, 21, 0.2);
            border-radius: 9999px;
            filter: blur(120px);
            pointer-events: none;
            z-index: 0;
            opacity: 0.25;
            animation: pulse 7s ease-in-out infinite;
          }
          .mobile-circle-left-middle {
            position: absolute;
            top: 50%;
            left: -150px;
            transform: translateY(-50%);
            width: 500px;
            height: 500px;
            background: rgba(248, 104, 0, 0.25);
            box-shadow: 0 0 200px 100px rgba(248, 104, 0, 0.2);
            border-radius: 9999px;
            filter: blur(120px);
            pointer-events: none;
            z-index: 0;
            opacity: 0.25;
            animation: pulse 8s ease-in-out infinite;
          }

          .mobile-card-content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
            text-align: center;
            padding: 2rem;
          }

          .icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            margin-bottom: 2rem;
            animation: float 3s ease-in-out infinite;
          }

          .icon-container :global(.phone-icon) {
            font-size: 60px;
            color: #f86800;
            animation: shake 2s ease-in-out infinite;
          }

          .icon-container :global(.arrow-icon) {
            font-size: 40px;
            color: #f86800;
          }

          .icon-container :global(.desktop-icon) {
            font-size: 70px;
            color: #f86800;
          }

          .mobile-card-content h2 {
            font-size: 1.8rem;
            font-weight: 600;
            color: #000;
            margin: 0 0 1rem 0;
          }

          .mobile-card-content p {
            font-size: 1.1rem;
            color: #666;
            line-height: 1.6;
            margin: 0;
            max-width: 400px;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }
      `}</style>
    </>
  );
};
