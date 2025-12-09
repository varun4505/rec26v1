"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

export const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const galleryImages = [
    {
      src: "/assets/images/gallery/1.png",
      alt: "Team Work",
      rotation: -12,
      x: -160,
      y: 110,
    },
    {
      src: "/assets/images/gallery/2.png",
      alt: "Lab Life",
      rotation: -6,
      x: -80,
      y: 40,
    },
    {
      src: "/assets/images/gallery/3.png",
      alt: "Core Team",
      rotation: 0,
      x: 0,
      y: -0,
    },
    {
      src: "/assets/images/gallery/4.png",
      alt: "Tech Talk",
      rotation: 6,
      x: 80,
      y: 40,
    },
    {
      src: "/assets/images/gallery/5.png",
      alt: "Fun Time",
      rotation: 12,
      x: 160,
      y: 110,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          <span className="hero-main-text">VinnovateIT</span>
          <span className="hero-subtitle">recruiting now</span>
        </h1>

        <a href="/profile" className="cta-button">
          LET'S GO
          <IoArrowForward className="button-icon" />
        </a>
      </section>

      {/* Gallery & Marquee Stack */}
      <section className="gallery-section">
        {/* Stacked Images */}
        <div className={`gallery-container ${isLoaded ? "spread" : ""}`}>
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className="gallery-card"
              style={
                {
                  zIndex: index === 2 ? 15 : 10,
                  "--final-rot": `${img.rotation}deg`,
                  "--final-x": `${img.x}%`,
                  "--final-y": `${img.y}px`,
                } as React.CSSProperties
              }
            >
              {/* Image Rendering */}
              <Image
                src={img.src}
                alt={img.alt}
                className="gallery-image"
                draggable={false}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </div>
          ))}
        </div>

        {/* Marquee Bands */}
        <div className="marquee-wrapper">
          {/* Band 1: Develop. Deliver. Dream. Design. (Array Font) */}
          <div className="marquee-band band-1">
            <div className="marquee-track">
              {/* Repeated content for seamless loop */}
              {[...Array(20)].map((_, i) => (
                <span key={i} className="marquee-text font-array">
                  Develop. Deliver. Dream. Design. &nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>

          {/* Band 2: Ideas in motion (Khand Font) */}
          <div className="marquee-band band-2">
            <div className="marquee-track reverse">
              {[...Array(20)].map((_, i) => (
                <span key={i} className="marquee-text font-khand">
                  Ideas in motion. Always. &nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Fonts */
        .font-array {
          font-family: var(--font-array), monospace;
        }
        .font-khand {
          font-family: var(--font-khand), sans-serif;
        }

        /* Hero */
        .hero-section {
          position: relative;
          z-index: 5;
          text-align: center;
          padding-top: 150px;
        }
        .hero-title {
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-main-text {
          color: #000;
          font-family: var(--font-array), monospace;
          font-size: 6rem;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: 0.06rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        @media (max-width: 768px) {
          .hero-main-text {
            font-size: 3.5rem;
          }
        }
        .hero-subtitle {
          font-family: var(--font-khand), sans-serif;
          font-weight: 300;
          color: #555;
          font-size: clamp(1.8rem, 4vw, 3rem);
          text-transform: lowercase;
          margin-top: -0.5rem;
        }

        /* Buttons */
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-radius: 9999px;
          font-family: var(--font-khand), sans-serif;
          line-height: 1;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.2s ease;
          opacity: 80%;
          cursor: pointer;
          border: none;
          position: relative;
          z-index: 5;
          text-decoration: none;
          text-transform: capitalize;
          background: linear-gradient(90deg, #ff9a5e 0%, #f86800 100%);
          color: #000;
          font-weight: 600;
          padding: 0.8rem 2rem 0.8rem 2.5rem;
          box-shadow: 0 4px 15px rgba(248, 104, 0, 0.2);
          font-size: 1.4rem;
        }
        .cta-button:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 10px 30px rgba(248, 104, 0, 0.4);
        }
        .cta-button:active {
          transform: scale(0.95);
        }
        :global(.button-icon) {
          font-size: 1.4em;
        }

        /* Gallery Spread */
        .gallery-section {
          position: relative;
          width: 100%;
          height: 650px;
          display: flex;
          justify-content: center;
          z-index: 5;
          margin-top: 5rem;
        }
        .gallery-container {
          position: relative;
          width: 320px;
          height: 220px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }
        .gallery-card {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 26px;
          overflow: hidden;
          background: #ddd;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          transform-origin: center center;
          transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: translate(0, 0) rotate(0deg) scale(0.9);
        }
        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .spread .gallery-card {
          transform: translate(var(--final-x), var(--final-y))
            rotate(var(--final-rot)) scale(1);
        }

        /* Marquee Bands */
        .marquee-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100vw;
          height: 100%;
          pointer-events: none;
          z-index: 20;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .marquee-band {
          position: absolute;
          backdrop-filter: blur(4px);
          width: 120vw;
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          left: -10vw;
        }
        .band-1 {
          background: rgba(246, 0, 21, 0.3);
          z-index: 2;
          display: inline-flex;
          transform: rotate(4.839deg);
          padding: 0.70675rem 0 0.7465rem 0;
          justify-content: center;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        .band-2 {
          background: rgba(248, 104, 0, 0.66);
          z-index: 1;
          margin-top: -15px;
          display: inline-flex;
          transform: rotate(-5.859deg);
          padding: 0.65506rem 0 0.65006rem 0;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .marquee-track {
          display: flex;
          animation: marquee 60s linear infinite;
          width: max-content;
        }
        .marquee-track.reverse {
          animation: marquee-reverse 60s linear infinite;
        }
        .marquee-text {
          font-size: 2rem;
          color: #fff;
          font-weight: 400;
          white-space: nowrap;
        }
        .marquee-text.font-array {
          font-family: var(--font-array), monospace;
          letter-spacing: 0.05rem;
        }
        .marquee-text.font-khand {
          font-family: var(--font-khand), sans-serif;
          font-weight: 500;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};
