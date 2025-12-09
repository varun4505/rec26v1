import React from "react";

export const BackgroundElements = () => {
  return (
    <>
      <div className="bg-grid"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <style jsx>{`
        /* --- Backgrounds --- */
        .bg-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 0;
          pointer-events: none;
        }

        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          animation: float 10s ease-in-out infinite;
          pointer-events: none;
        }
        .blob-1 {
          width: 600px;
          height: 600px;
          background: #f86800;
          opacity: 0.25;
          top: -200px;
          right: -100px;
        }
        .blob-2 {
          width: 500px;
          height: 500px;
          background: #f86800;
          opacity: 0.15;
          bottom: -100px;
          left: -100px;
          animation-delay: -5s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -20px);
          }
        }
      `}</style>
    </>
  );
};
