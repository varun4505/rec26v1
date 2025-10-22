"use client";

import React from "react";
import type { SubdomainItem } from "@/data/domains";

interface ApplicationCardProps {
  application: SubdomainItem;
  index: number;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  index,
}) => {
  const isRejected = application.status === "Rejected";
  const isShortlisted = application.status === "Shortlisted";
  const isInterviewScheduled = application.status === "Interview Scheduled";

  return (
    <>
      <div className="application-card">
        {/* Header */}
        <div className="card-header">
          <h3 className="subdomain-title">{application.subdomain}</h3>
          <p className="domain-subtitle">{application.domain}</p>
        </div>

        {/* Scrollable Status Section */}
        <div className="status-section-wrapper">
          <div className="status-section">
            {isRejected && application.rejectionMessage ? (
              // Rejection Message View
              <div className="rejection-container">
                <div className="rejection-message">
                  <strong>{application.rejectionMessage}</strong>
                </div>
                {application.rejectionDetails && (
                  <div className="rejection-details">
                    {application.rejectionDetails}
                  </div>
                )}
              </div>
            ) : isInterviewScheduled ? (
              // Interview Details View
              <div className="interview-container">
                <div className="interview-label">Interview Scheduled</div>
                <div className="interview-details">
                  <div className="detail-row">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <line
                        x1="3"
                        y1="10"
                        x2="21"
                        y2="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="8"
                        y1="2"
                        x2="8"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="16"
                        y1="2"
                        x2="16"
                        y2="6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{application.interviewDate}</span>
                  </div>
                  <div className="detail-row">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M12 6v6l4 2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{application.interviewTime}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Normal Status View
              <div className="status-item">
                <div className="status-info">
                  <div className="round-label">{application.round}</div>
                  <div className="status-label">{application.status}</div>
                </div>
                <button className="edit-btn" aria-label="Edit response">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer Button */}
        {application.showNextButton !== false && (
          <div className="card-footer-fixed">
            {isRejected ? (
              <button className="hide-btn">HIDE APPLICATION</button>
            ) : isShortlisted ? (
              <button className="next-btn">SCHEDULE INTERVIEW</button>
            ) : isInterviewScheduled ? (
              <button className="next-btn">VIEW DETAILS</button>
            ) : (
              <button className="next-btn">NEXT</button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .application-card {
          background: #f868004d;
          border-radius: clamp(14px, 2.5vw, 20px);
          padding: clamp(1.2rem, 2.5vw, 1.8rem);
          flex: 0 0 auto;
          min-width: 280px;
          max-width: 340px;
          max-height: 520px;
          display: flex;
          flex-direction: column;
          animation: fadeInUp 1s ease-out both;
          transition: transform 0.3s ease;
          animation-delay: ${0.4 + index * 0.1}s;
        }
        .application-card:hover {
          transform: translateY(-5px);
        }
        .card-header {
          flex-shrink: 0;
          margin-bottom: clamp(0.8rem, 1.8vw, 1.2rem);
        }
        .subdomain-title {
          font-size: clamp(1.3rem, 3vw, 1.7rem);
          margin: 0 0 0.3rem 0;
          font-weight: 600;
          color: #000;
          line-height: 1.2;
        }
        .domain-subtitle {
          font-size: clamp(0.8rem, 1.8vw, 1rem);
          margin: 0;
          color: #666;
          font-weight: 400;
        }
        .status-section-wrapper {
          flex: 1;
          overflow: hidden;
          min-height: 0;
          margin-bottom: clamp(0.8rem, 1.8vw, 1.2rem);
          position: relative;
        }
        .status-section {
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 0.5rem;
          padding-bottom: 0.5rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .status-section::-webkit-scrollbar {
          display: none;
        }
        .rejection-container,
        .interview-container {
          display: flex;
          flex-direction: column;
          gap: clamp(0.5rem, 1.2vw, 0.7rem);
        }
        .rejection-message,
        .interview-label {
          font-size: clamp(0.85rem, 1.8vw, 1rem);
          color: #000;
          line-height: 1.4;
          font-weight: 600;
        }
        .rejection-details {
          font-size: clamp(0.75rem, 1.6vw, 0.88rem);
          color: #333;
          line-height: 1.5;
          white-space: pre-line;
        }
        .interview-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: clamp(0.8rem, 1.6vw, 0.92rem);
          color: #333;
        }
        .detail-row svg {
          color: #0d0d0d;
          flex-shrink: 0;
          width: 14px;
          height: 14px;
        }
        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: clamp(0.5rem, 1.8vw, 0.8rem);
          padding-right: 0.5rem;
        }
        .status-info {
          flex: 1;
          min-width: 0;
        }
        .round-label {
          font-size: clamp(0.9rem, 1.8vw, 1.1rem);
          font-weight: 600;
          display: block;
          margin-bottom: 0.2rem;
          color: #000;
        }
        .status-label {
          font-size: clamp(0.75rem, 1.6vw, 0.9rem);
          color: #333;
          display: block;
          font-weight: 400;
        }
        .edit-btn {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0.5) 100%
          );
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ff8c42;
          border-radius: 50%;
          width: clamp(30px, 5vw, 36px);
          height: clamp(30px, 5vw, 36px);
          cursor: pointer;
          box-shadow: 2px 0px 8px 1px rgba(248, 104, 0, 0.15),
            inset 1px 1px 3px rgba(255, 255, 255, 0.5),
            inset -1px -1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0;
          overflow: hidden;
        }
        .edit-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s ease;
        }
        .edit-btn:hover::before {
          left: 100%;
        }
        .edit-btn svg {
          width: clamp(14px, 2.5vw, 17px);
          height: clamp(14px, 2.5vw, 17px);
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }
        .edit-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(255, 255, 255, 0.65) 100%
          );
          transform: scale(1.1) rotate(15deg);
          box-shadow: 2px 0px 10px 2px rgba(248, 104, 0, 0.2),
            inset 1px 1px 5px rgba(255, 255, 255, 0.6),
            inset -1px -1px 5px rgba(0, 0, 0, 0.08);
        }
        .edit-btn:hover svg {
          transform: rotate(-15deg);
        }
        .edit-btn:active {
          transform: scale(0.95);
        }
        .card-footer-fixed {
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          padding-top: clamp(0.8rem, 1.5vw, 1.2rem);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          margin-top: auto;
        }
        .next-btn,
        .hide-btn {
          position: relative;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0.5) 100%
          );
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #000;
          border-radius: 59px;
          padding: clamp(0.55rem, 1.3vw, 0.75rem) clamp(1.8rem, 3.5vw, 2.5rem);
          font-size: clamp(0.75rem, 1.6vw, 0.88rem);
          cursor: pointer;
          box-shadow: 2px 0px 8px 1px rgba(248, 104, 0, 0.15),
            inset 1px 1px 3px rgba(255, 255, 255, 0.5),
            inset -1px -1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          font-weight: 500;
          letter-spacing: 2px;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          text-transform: uppercase;
        }
        .next-btn::before,
        .hide-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.6s ease;
        }
        .next-btn:hover::before,
        .hide-btn:hover::before {
          left: 100%;
        }
        .next-btn:hover,
        .hide-btn:hover {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(255, 255, 255, 0.65) 100%
          );
          transform: translateY(-2px);
          box-shadow: 2px 0px 10px 2px rgba(248, 104, 0, 0.2),
            inset 1px 1px 5px rgba(255, 255, 255, 0.6),
            inset -1px -1px 5px rgba(0, 0, 0, 0.08);
        }
        .next-btn:active,
        .hide-btn:active {
          transform: translateY(0);
        }
        .hide-btn {
          font-weight: 600;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
