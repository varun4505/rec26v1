"use client";

import React from "react";
import Image from "next/image";

export default function DomainsSection() {
  const domainData = [
    {
      title: "Tech",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      bg: "#FFD4B2", // Peach
      img: "/assets/images/computer.png",
    },
    {
      title: "Design",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      bg: "#FFB6C1", // Pink
      img: "/assets/images/palette.png",
    },
    {
      title: "Management",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      bg: "#FFD4B2", // Peach
      img: "/assets/images/glasses.png",
    },
  ];

  return (
    <section className="domains-section">
      <h2 className="domains-title font-array">Domains</h2>
      
      <div className="domains-grid">
        {domainData.map((domain, index) => (
          <div 
            key={index} 
            className="domain-card"
            style={{ backgroundColor: domain.bg }}
          >
            <h3 className="card-title font-array">{domain.title}</h3>
            <p className="card-desc font-khand">{domain.desc}</p>
            
            <div className="card-img-container">
              <Image 
                src={domain.img} 
                alt={domain.title} 
                width={200} 
                height={200}
                className="domain-icon"
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        /* --- Fonts --- */
        .font-array {
          font-family: var(--font-array), monospace;
        }
        .font-khand {
          font-family: var(--font-khand), sans-serif;
        }

        /* --- Domains Section --- */
        .domains-section {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1.5rem 8rem 1.5rem;
          text-align: center;
        }

        .domains-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 4rem;
          color: #000;
          letter-spacing: 0.1rem;
        }

        .domains-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
          width: 100%;
        }

        /* Tablet & Desktop: Switch to 3 columns */
        @media (min-width: 768px) {
          .domains-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .domain-card {
          border-radius: 30px;
          padding: 2rem 2rem 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          height: 400px;
          transition: transform 0.3s ease;
          
          background-clip: padding-box;
          opacity: 1; 
          z-index: 10;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .domain-card:hover {
          transform: translateY(-10px);
        }

        .card-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #000;
        }

        .card-desc {
          font-size: 1.3rem;
          color: #444;
          line-height: 1.5;
          margin-bottom: auto;
          max-width: 90%;
        }

        .card-img-container {
          width: 100%;
          height: 160px; 
          display: flex;
          justify-content: center;
          align-items: flex-end;
          margin-top: auto; 
          margin-bottom: -1px; 
        }

        :global(.domain-icon) {
          object-fit: contain;
          image-rendering: pixelated;
          max-height: 100%;
          transition: transform 0.3s ease;
        }

        .domain-card:hover :global(.domain-icon) {
          transform: scale(1.1) rotate(-5deg);
        }
      `}</style>
    </section>
  );
}
