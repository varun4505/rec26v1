"use client";

import React from "react";

export const DecorativeCircles: React.FC = () => {
  return (
    <>
      <div className="circle-top-right"></div>
      <div className="circle-bottom-right"></div>
      <div className="circle-left-middle"></div>

      <style jsx>{`
        .circle-top-right {
          position: absolute;
          top: -200px;
          right: -200px;
          width: 400px;
          height: 400px;
          background: rgba(14, 50, 74, 0.30);
          box-shadow: 400px 400px 400px;
          border-radius: 9999px;
          filter: blur(200px);
          pointer-events: none;
          z-index: 0;
          animation: pulse 6s ease-in-out infinite;
        }
        .circle-bottom-right {
          position: absolute;
          bottom: -200px;
          right: clamp(1rem, 3vw, 2rem);
          width: 400px;
          height: 400px;
          background: rgba(246, 0, 21, 0.30);
          box-shadow: 400px 400px 400px;
          border-radius: 9999px;
          filter: blur(200px);
          pointer-events: none;
          z-index: 0;
          animation: pulse 7s ease-in-out infinite;
        }
        .circle-left-middle {
          position: absolute;
          top: 50%;
          left: -200px;
          transform: translateY(-50%);
          width: 400px;
          height: 400px;
          background: rgba(248, 104, 0, 0.30);
          box-shadow: 400px 400px 400px;
          border-radius: 9999px;
          filter: blur(200px);
          pointer-events: none;
          z-index: 0;
          animation: pulse 8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
};
