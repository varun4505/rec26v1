"use client";

import React from "react";
import { DomainItem } from "@/components/DomainItem";
import type { Domain } from "@/data/domains";

interface DomainCardProps {
  domain: Domain;
  index: number;
}

export const DomainCard: React.FC<DomainCardProps> = ({ domain, index }) => {
  return (
    <>
      <div className="domain-card">
        {/* Fixed Header */}
        <div className="card-header">
          <h3 className="domain-title">{domain.title}</h3>
        </div>

        {/* Scrollable Content Area with Fade Mask */}
        <div className="domain-items-container">
          <div className="domain-items-wrapper">
            {domain.items.map((item, idx) => (
              <DomainItem key={idx} label={item.label} status={item.status} />
            ))}
            {/* Bottom Spacer */}
            <div className="bottom-spacer"></div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="card-footer">
          <button className="select-more-btn">
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
                strokeLinecap="round"
              />
            </svg>
            ADD
          </button>
        </div>
      </div>

      <style jsx>{`
        .domain-card {
          background: #f868004d;
          border-radius: clamp(16px, 3vw, 22px);
          padding: clamp(1rem, 3vw, 2rem);
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: fadeInUp 1s ease-out both;
          transition: transform 0.3s ease;
          animation-delay: ${0.4 + index * 0.1}s;
        }
        .domain-card:hover {
          transform: translateY(-5px);
        }
        .card-header {
          flex-shrink: 0;
          margin-bottom: clamp(0.4rem, 1vw, 0.75rem);
        }
        .domain-title {
          font-size: clamp(1.3rem, 3vw, 1.8rem);
          margin: 0;
          font-weight: 600;
          color: #000;
        }
        .domain-items-container {
          flex: 1;
          overflow: hidden;
          min-height: 0;
          position: relative;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
        .domain-items-wrapper {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: clamp(0.8rem, 2vw, 1.2rem);
          overflow-y: auto;
          overflow-x: hidden;
          padding: clamp(10px, 2vh, 20px) 0.5rem 0 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        .domain-items-wrapper::-webkit-scrollbar {
          width: 4px;
        }
        .domain-items-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }
        .domain-items-wrapper::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .domain-items-wrapper::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .bottom-spacer {
          height: clamp(60px, 10vh, 100px);
          flex-shrink: 0;
        }
        .card-footer {
          flex-shrink: 0;
          padding-top: clamp(0.25rem, 1vw, 0.5rem);
        }
        .select-more-btn {
          background: #fff;
          color: #585858;
          border: none;
          border-radius: clamp(12px, 2vw, 16px);
          padding: clamp(0.5rem, 1.5vw, 0.6rem) clamp(1rem, 3vw, 1.6rem);
          font-size: clamp(0.9rem, 2vw, 1rem);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
          transition: all 0.3s ease;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .select-more-btn svg {
          flex-shrink: 0;
          width: clamp(14px, 2.5vw, 16px);
          height: clamp(14px, 2.5vw, 16px);
          transition: transform 0.3s ease;
        }
        .select-more-btn:hover {
          background: #ffe4d0;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 140, 66, 0.2);
        }
        .select-more-btn:hover svg {
          transform: rotate(90deg);
        }
        .select-more-btn:active {
          transform: translateY(0);
        }
        @media (max-width: 900px) {
          .domain-card {
            flex: 0 0 auto;
            min-height: 300px;
            max-height: 400px;
          }
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
