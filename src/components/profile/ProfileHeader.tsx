"use client";

import React from "react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  registrationNumber: string;
  phoneNumber?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  registrationNumber,
  phoneNumber,
}) => {
  return (
    <>
      <div className="info-section">
        <div>
          <h1 className="greeting">Hey {name}!</h1>
          <p className="email">{email}</p>
        </div>
        {registrationNumber && (
          <div className="user-info">
            <div>{registrationNumber}</div>
          </div>
        )}
      </div>

      <style jsx>{`
        .info-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.9rem;
          margin-bottom: clamp(0.9rem, 2.7vw, 1.8rem);
          flex-shrink: 0;
          flex-wrap: wrap;
          animation: fadeIn 1s ease-out 0.2s both;
        }
        .greeting {
          font-size: clamp(1.8rem, 4.5vw, 3.15rem);
          margin: 0 0 0.18rem 0;
          font-weight: 600;
          color: #000;
        }
        .email {
          color: #9e9e9e;
          font-size: clamp(0.81rem, 1.8vw, 1.26rem);
          margin: 0;
          transition: color 0.3s ease;
        }
        .email:hover {
          color: #ff8c42;
        }
        .user-info {
          color: #727272;
          text-align: right;
          font-size: clamp(0.81rem, 1.8vw, 1.26rem);
          display: flex;
          flex-direction: column;
          gap: 0.27rem;
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
