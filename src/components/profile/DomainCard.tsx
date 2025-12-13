// src/components/profile/DomainCard.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getDomainConfig } from "@/data/domainConfig";

interface UserApplication {
  domain: string;
  subdomain: string | null;
  round1Status: string;
  round2Status: string | null;
  canAccessRound2: boolean;
}

interface ApplicationCardProps {
  application: UserApplication;
  index: number;
}

const formatDomainName = (domain: string): string => {
  return domain.charAt(0).toUpperCase() + domain.slice(1);
};

const formatSubdomainName = (subdomain: string | null): string => {
  if (!subdomain) return "";
  // Special cases for AIML and UIUX
  if (subdomain.toLowerCase() === "aiml") return "AIML";
  if (subdomain.toLowerCase().replace(/[-\s]/g, "") === "uiux") return "UIUX";
  return subdomain
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  index,
}) => {
  const router = useRouter();
  const domainName = formatDomainName(application.domain);
  const subdomainName = application.subdomain
    ? formatSubdomainName(application.subdomain)
    : domainName;

  const config = getDomainConfig(application.domain.toLowerCase() as any);
  const isSingleRound = config?.rounds.length === 1;

  const handleRoundClick = (round: string) => {
    const roundPath = round === "Round 1" ? "round1" : "round2";
    const url = `/quiz/${application.domain}/${application.subdomain || "none"
      }/${roundPath}`;
    router.push(url);
  };

  const isRejected =
    application.round1Status === "Not Passed" ||
    application.round2Status === "Not Passed";
  const round1FormSubmitted =
    application.round1Status === "Under Review" ||
    application.round1Status === "Passed";
  const round2FormSubmitted =
    application.round2Status === "Under Review" ||
    application.round2Status === "Passed";

  return (
    <>
      <div className="application-card">
        {/* Header - Fixed */}
        <div className="card-header">
          <h3 className="subdomain-title">{subdomainName}</h3>
          <p className="domain-subtitle">{domainName}</p>
        </div>

        {/* Body - Scrollable with top and bottom fade */}
        <div className="card-body">
          {isRejected ? (
            <div className="rejected-full-content">
              <div className="rejection-message-bold">
                Hey, thanks for giving the recruitment your best shot.
              </div>
              <div className="rejection-details-text">
                You didn't make it to the next round this time, but your effort
                didn't go unnoticed.
                <br />
                Keep learning, keep building — we'd love to see you apply again
                soon.
              </div>
            </div>
          ) : (
            <>
              {/* Round 1 Status */}
              <div className="status-item">
                <div className="status-info">
                  <div className="round-label">Round 1</div>
                  <div className="status-label">{application.round1Status}</div>
                </div>
                {application.round1Status === "Pending" && (
                  <button
                    className="glass-icon-button"
                    style={{
                      width: "clamp(30px, 5vw, 36px)",
                      height: "clamp(30px, 5vw, 36px)",
                    }}
                    aria-label="Edit Round 1"
                    onClick={() => handleRoundClick("Round 1")}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        width: "clamp(14px, 2.5vw, 17px)",
                        height: "clamp(14px, 2.5vw, 17px)",
                      }}
                    >
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Round 2 Status (Only for multi-round domains) */}
              {!isSingleRound && application.round2Status && !isRejected && (
                <div className="status-item" style={{ marginTop: "12px" }}>
                  <div className="status-info">
                    <div className="round-label">Round 2</div>
                    <div className="status-label">
                      {application.round2Status}
                    </div>
                  </div>
                  {application.round2Status === "Pending" && (
                    <button
                      className="glass-icon-button"
                      style={{
                        width: "clamp(30px, 5vw, 36px)",
                        height: "clamp(30px, 5vw, 36px)",
                      }}
                      aria-label="Edit Round 2"
                      onClick={() => handleRoundClick("Round 2")}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          width: "clamp(14px, 2.5vw, 17px)",
                          height: "clamp(14px, 2.5vw, 17px)",
                        }}
                      >
                        <path
                          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  )}
                  {/* Removed duplicate Schedule Interview icon button since we have Next Step block now */}
                </div>
              )}

              {/* Schedule Interview Block (For both Single and Multi round domains) */}
              {((isSingleRound && application.round1Status === "Passed") ||
                (!isSingleRound && application.round2Status === "Passed")) && (
                  <div className="status-item" style={{ marginTop: "12px" }}>
                    <div className="status-info">
                      <div className="round-label">Next Step</div>
                      <div className="status-label">Interview</div>
                    </div>
                    <button
                      className="glass-icon-button"
                      style={{
                        width: "clamp(30px, 5vw, 36px)",
                        height: "clamp(30px, 5vw, 36px)",
                      }}
                      aria-label="Schedule Interview"
                      onClick={() => alert("Redirecting to interview scheduler...")}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          width: "clamp(14px, 2.5vw, 17px)",
                          height: "clamp(14px, 2.5vw, 17px)",
                        }}
                      >
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                )}
            </>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="card-footer-fixed">
          {!isRejected && (
            <button
              className="glass-button"
              style={{
                width: "100%",
                padding:
                  "clamp(0.55rem, 1.3vw, 0.75rem) clamp(1.8rem, 3.5vw, 2.5rem)",
                fontSize: "clamp(0.75rem, 1.6vw, 0.88rem)",
              }}
              onClick={() => {
                if (application.round2Status === "Passed" || (isSingleRound && application.round1Status === "Passed")) {
                  alert("Redirecting to interview scheduler...");
                } else {
                  handleRoundClick(
                    application.round2Status ? "Round 2" : "Round 1"
                  );
                }
              }}
            >
              {(!isSingleRound && (application.round2Status === "Pending" ||
                application.round2Status === "Not Started"))
                ? "MOVE TO NEXT STEP"
                : application.round1Status === "Pending"
                  ? "MOVE TO NEXT STEP"
                  : (application.round2Status === "Passed" || (isSingleRound && application.round1Status === "Passed"))
                    ? "SCHEDULE INTERVIEW"
                    : application.round1Status === "Submitted" ||
                      application.round1Status === "Under Review" ||
                      application.round1Status === "Passed"
                      ? "EDIT FORM"
                      : "VIEW STATUS"}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .application-card {
          background: #f868004d;
          border-radius: clamp(14px, 2.5vw, 18px);
          padding: clamp(0.9rem, 1.8vw, 1.2rem);
          flex: 0 0 auto;
          min-width: 340px;
          max-width: 400px;
          min-height: 200px; /* or whatever works */
          flex-shrink: 0;
          height: 100%;
          max-height: 100%;
          display: flex;
          flex-direction: column;
          animation: fadeInUp 1s ease-out both;
          transition: transform 0.3s ease;
          animation-delay: ${0.4 + index * 0.1}s;
          box-sizing: border-box;
        }
        .application-card:hover {
          transform: translateY(-5px);
        }

        /* Header - Fixed at top */
        .card-header {
          flex-shrink: 0;
        }
        .subdomain-title {
          font-size: clamp(1.3rem, 2.8vw, 1.6rem);
          margin: 0 0 0.2rem 0;
          font-weight: 600;
          color: #000;
          line-height: 1.2;
        }
        .domain-subtitle {
          font-size: clamp(0.8rem, 1.7vw, 0.95rem);
          margin: 0;
          color: #000;
          font-weight: 400;
          opacity: 0.7;
        }

        /* Body - Scrollable with fade on BOTH top and bottom */
        .card-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: visible;
          min-height: 0;
          margin-bottom: clamp(0.6rem, 1.5vw, 0.9rem);
          padding: 16px 0.4rem 16px 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
          position: relative;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 16px,
            black calc(100% - 16px),
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 16px,
            black calc(100% - 16px),
            transparent 100%
          );
        }
        .card-body::-webkit-scrollbar {
          display: none;
        }

        /* Rejected Card Content */
        .rejected-full-content {
          display: flex;
          flex-direction: column;
          gap: clamp(0.8rem, 1.8vw, 1.2rem);
          background: rgba(248, 104, 0, 0.3);
          border-radius: clamp(12px, 2vw, 16px);
          padding: clamp(1rem, 2vw, 1.5rem);
        }
        .rejection-message-bold {
          font-size: clamp(0.85rem, 1.8vw, 1rem);
          font-weight: 700;
          color: #000;
          line-height: 1.5;
        }
        .rejection-details-text {
          font-size: clamp(0.75rem, 1.6vw, 0.88rem);
          color: #333;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Interview Card Content */
        .interview-container {
          display: flex;
          flex-direction: column;
          gap: clamp(0.5rem, 1.2vw, 0.7rem);
        }
        .interview-label {
          font-size: clamp(0.85rem, 1.8vw, 1rem);
          color: #000;
          line-height: 1.4;
          font-weight: 600;
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
          color: #ff8c42;
          flex-shrink: 0;
          width: 14px;
          height: 14px;
        }

        /* Status Content */
        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: clamp(0.5rem, 1.8vw, 0.8rem);
          padding-right: 0.5rem;
        }
        .status-item-no-button {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .status-info {
          flex: 1;
          min-width: 0;
        }
        .round-label {
          font-size: clamp(0.9rem, 1.8vw, 1.05rem);
          font-weight: 600;
          display: block;
          margin-bottom: 0.15rem;
          color: #000;
        }
        .status-label {
          font-size: clamp(0.85rem, 1.8vw, 1rem);
          display: block;
          font-weight: 600;
          color: #000;
          opacity: 0.8;
        }

        /* Feedback Box */
        .feedback-box {
          background: rgba(255, 255, 255, 0.5);
          border-radius: clamp(10px, 1.8vw, 14px);
          padding: clamp(0.7rem, 1.5vw, 1rem);
          margin-top: 8px;
        }
        .feedback-label {
          font-size: clamp(0.75rem, 1.6vw, 0.85rem);
          font-weight: 600;
          color: #000;
          margin-bottom: 0.3rem;
        }
        .feedback-text {
          font-size: clamp(0.7rem, 1.5vw, 0.8rem);
          color: #333;
          line-height: 1.5;
          font-weight: 400;
        }

        /* Rejected Card Content */
        .rejected-full-content {
          display: flex;
          flex-direction: column;
          gap: clamp(0.8rem, 1.8vw, 1.2rem);
          background: rgba(248, 104, 0, 0.3);
          border-radius: clamp(12px, 2vw, 16px);
          padding: clamp(1rem, 2vw, 1.5rem);
        }
        .rejection-message-bold {
          font-size: clamp(0.85rem, 1.8vw, 1rem);
          font-weight: 700;
          color: #000;
          line-height: 1.5;
        }
        .rejection-details-text {
          font-size: clamp(0.75rem, 1.6vw, 0.88rem);
          color: #333;
          line-height: 1.6;
          font-weight: 400;
        }
        .feedback-inline {
          font-size: clamp(0.75rem, 1.6vw, 0.88rem);
          color: #333;
          line-height: 1.5;
          margin-top: 0.5rem;
        }

        /* Glass Button */
        .glass-icon-button {
          background: rgba(255, 255, 255, 0.5);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
          color: #f86800;
        }
        .glass-icon-button:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.6);
          border: none;
          border-radius: clamp(10px, 1.8vw, 13px);
          font-weight: 600;
          color: #000;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(5px);
        }
        .glass-button:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
        }

        /* Footer - Fixed at bottom */
        .card-footer-fixed {
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          padding-top: clamp(0.6rem, 1.2vw, 0.9rem);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          margin-top: auto;
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
