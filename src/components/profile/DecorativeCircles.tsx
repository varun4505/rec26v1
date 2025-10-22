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
        .circle-bottom-right {
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
        .circle-left-middle {
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
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
};
