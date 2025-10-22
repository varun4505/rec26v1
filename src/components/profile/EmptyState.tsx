"use client";

import React from "react";
import { MdOutlineFolderOpen } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

export const EmptyState: React.FC = () => {
  return (
    <>
      <div className="empty-state">
        <div className="icon-container">
          <MdOutlineFolderOpen className="folder-icon" />
          <IoAddCircleOutline className="add-icon" />
        </div>
        <h3>No Applications Yet</h3>
        <p>Choose your subdomains and start your journey with us!</p>
        <button className="add-btn-empty">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          ADD DOMAIN
        </button>
      </div>

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          text-align: center;
          padding: 1.8rem;
          animation: fadeIn 1s ease-out;
          min-height: 0;
        }

        .icon-container {
          position: relative;
          margin-bottom: 1.35rem;
          animation: float 4s ease-in-out infinite;
        }

        .icon-container :global(.folder-icon) {
          font-size: clamp(72px, 10.8vw, 108px);
          color: #f86800;
          opacity: 0.8;
        }

        .icon-container :global(.add-icon) {
          position: absolute;
          bottom: 8px;
          right: -9px;
          font-size: clamp(31.5px, 4.5vw, 45px);
          color: #ff8c42;
          background: white;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .empty-state h3 {
          font-size: clamp(1.17rem, 2.25vw, 1.62rem);
          font-weight: 600;
          color: #000;
          margin: 0 0 0.54rem 0;
        }

        .empty-state p {
          font-size: clamp(0.855rem, 1.62vw, 0.99rem);
          color: #666;
          margin: 0 0 1.62rem 0;
          max-width: 315px;
          line-height: 1.5;
        }

        .add-btn-empty {
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
          padding: 0.675rem 1.8rem;
          font-size: 0.855rem;
          cursor: pointer;
          box-shadow: 2px 0px 8px 1px rgba(248, 104, 0, 0.15),
            inset 1px 1px 3px rgba(255, 255, 255, 0.5),
            inset -1px -1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-shrink: 0;
          text-transform: uppercase;
          letter-spacing: 1.35px;
        }

        .add-btn-empty:hover {
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-13.5px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
