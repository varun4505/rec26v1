"use client";

import React from "react";

interface DomainItemProps {
  label: string;
  status: string;
}

export const DomainItem: React.FC<DomainItemProps> = ({ label, status }) => {
  return (
    <>
      <div className="domain-item">
        <div className="item-info">
          <div className="item-label">{label}</div>
          <div className="item-status">{status}</div>
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
              stroke="currentColor"
              fill="none"
            />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .domain-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: clamp(0.5rem, 2vw, 1rem);
        }
        .item-info {
          flex: 1;
          min-width: 0;
        }
        .item-label {
          font-size: clamp(1rem, 2vw, 1.2rem);
          font-weight: 500;
          display: block;
          margin-bottom: 0.2rem;
          color: #000;
        }
        .item-status {
          font-size: clamp(0.85rem, 1.8vw, 1rem);
          color: #666;
          display: block;
        }
        .edit-btn {
          background: #fff;
          color: #ff8c42;
          border: none;
          border-radius: 50%;
          width: clamp(35px, 6vw, 40px);
          height: clamp(35px, 6vw, 40px);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0;
        }
        .edit-btn svg {
          width: clamp(16px, 3vw, 20px);
          height: clamp(16px, 3vw, 20px);
          transition: transform 0.3s ease;
        }
        .edit-btn:hover {
          background: #ffe4d0;
          transform: scale(1.1) rotate(15deg);
          box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);
        }
        .edit-btn:hover svg {
          transform: rotate(-15deg);
        }
        .edit-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};
