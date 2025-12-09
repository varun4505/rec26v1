"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";
import MainNavbar from "./components/Navbar";
// Replace with next/image when assets are available
import Image from "next/image";
import LandingProjects from "./landing_projects";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animations after mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Image configuration for the stack effect
  const galleryImages = [
    {
      src: "/assets/images/Team_Work.jpg",
      alt: "Team Work",
      rotation: -12,
      x: -160,
      y: 40,
    },
    {
      src: "/assets/images/Lab_Life.jpg",
      alt: "Lab Life",
      rotation: -6,
      x: -80,
      y: 10,
    },
    {
      src: "/assets/images/Core_Team.jpg",
      alt: "Core Team",
      rotation: 0,
      x: 0,
      y: 0,
    },
    {
      src: "/assets/images/Tech_Talk.jpg",
      alt: "Tech Talk",
      rotation: 6,
      x: 80,
      y: 10,
    },
    {
      src: "/assets/images/Fun_Time.jpg",
      alt: "Fun Time",
      rotation: 12,
      x: 160,
      y: 40,
    },
  ];

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
    <main className="home-wrapper">
      {/* Navbar placed specifically for this page */}
      <MainNavbar />

      {/* Background Elements */}
      <div className="bg-grid"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          <span className="hero-main-text">VinnovateIT</span>
          <br />
          <span className="hero-subtitle">recruiting now</span>
        </h1>

        <Link href="/login" className="cta-button">
          <span>Lets go</span>
          <IoArrowForward className="button-icon" />
        </Link>
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
                  zIndex: index === 2 ? 10 : 5, // Center card on top
                  "--final-rot": `${img.rotation}deg`,
                  "--final-x": `${img.x}%`,
                  "--final-y": `${img.y}px`,
                } as React.CSSProperties
              }
            >
              <div className="image-placeholder">
                <span>{img.alt}</span>
              </div>
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
                  Develop. Deliver. Dream. Design. &nbsp;•&nbsp;
                </span>
              ))}
            </div>
          </div>

          {/* Band 2: Ideas in motion (Khand Font) */}
          <div className="marquee-band band-2">
            <div className="marquee-track reverse">
              {[...Array(20)].map((_, i) => (
                <span key={i} className="marquee-text font-khand">
                  Ideas in motion. Always. &nbsp;•&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2 className="about-title font-array">About VinnovateIT</h2>
        <div className="about-content">
          <p>
            VinnovateIT is the official innovation and incubation lab of SITE
            School, VIT Vellore. To put it simply...we are the answer to the
            question &quot;What if Elon Musk and Albert Einstein had a brain
            child?&quot; We aim to be the one stop destination for all you
            curious cats and satisfy your hunger in the diverse world of
            computer science.
          </p>
        </div>
        <button className="cta-button secondary">Explore More</button>
      </section>

      {/* DOMAINS SECTION */}
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
                {/* This is the new part: */}
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

      </section>
      <section>
        <LandingProjects />
      </section>

      <style jsx>{`
        .home-wrapper {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background: #fdfdfd;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: var(--font-khand), sans-serif;
        }

        /* --- Fonts --- */
        .font-array {
          font-family: var(--font-array), monospace;
        }
        .font-khand {
          font-family: var(--font-khand), sans-serif;
        }

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

        /* --- Hero --- */
        .hero-section {
          position: relative;
          z-index: 5;
          text-align: center;
          padding-top: 180px;
          margin-bottom: 3rem;
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

        /* --- Buttons --- */
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 56px; /* Well padded */
          border-radius: 9999px; /* Fully rounded */
          font-family: var(--font-khand), sans-serif;
          font-weight: 700;
          font-size: 1.6rem;
          line-height: 1;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.2s ease;
          cursor: pointer;
          border: none;
          position: relative;
          z-index: 20;
          text-decoration: none;
          text-transform: capitalize;

          /* User Specified Color */
          background-color: #f86800a8;
          color: #000;
          backdrop-filter: blur(4px);
          box-shadow: 0 4px 20px rgba(248, 104, 0, 0.25);
        }
        .cta-button:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 10px 30px rgba(248, 104, 0, 0.4);
        }
        .cta-button:active {
          transform: scale(0.95);
        }

        /* Icon within button */
        :global(.button-icon) {
          font-size: 1.4em;
        }

        .cta-button.secondary {
          background: linear-gradient(90deg, #ff9a5e 0%, #f86800 100%);
          color: #000;
          font-weight: 600;
          padding: 0.8rem 3.5rem;
          box-shadow: 0 4px 15px rgba(248, 104, 0, 0.2);
          font-size: 1.4rem;
        }

        /* --- Gallery Spread --- */
        .gallery-section {
          position: relative;
          width: 100%;
          height: 650px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 5;
          margin-bottom: 2rem;
          perspective: 1000px;
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
          border-radius: 12px;
          overflow: hidden;
          background: #ddd;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          transform-origin: center center;
          transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 5px solid #fff;

          /* Initial State: Stacked */
          transform: translate(0, 0) rotate(0deg) scale(0.9);
        }

        /* Spread State */
        .spread .gallery-card {
          transform: translate(var(--final-x), var(--final-y))
            rotate(var(--final-rot)) scale(1);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777;
          font-weight: 600;
          font-size: 1.2rem;
        }

        /* --- Marquee Bands --- */
        .marquee-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100vw;
          height: 100%;
          pointer-events: none;
          z-index: 5;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .marquee-band {
          position: absolute;
          width: 120vw;
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          left: -10vw;
        }

        /* Band 1: Develop. Deliver. Dream. Design. */
        .band-1 {
          background: rgba(246, 0, 21, 0.3);
          backdrop-filter: blur(4px);
          z-index: 1;

          /* Exact user styles */
          display: inline-flex;
          transform: rotate(4.839deg);
          padding: 0.73675rem 0 0.7865rem 0;
          justify-content: flex-end;
          align-items: center;

          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        /* Band 2: Ideas in motion. Always. */
        .band-2 {
          background: rgba(248, 104, 0, 0.66);
          z-index: 2;
          margin-top: -15px;

          /* Exact user styles */
          display: inline-flex;
          transform: rotate(-5.859deg);
          padding: 0.69506rem 0 0.64006rem 0;
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
          font-size: 1.8rem;
          color: #fff;
          font-weight: 500;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .marquee-text.font-array {
          font-family: var(--font-array), monospace;
          letter-spacing: 0.05rem;
        }

        .marquee-text.font-khand {
          font-family: var(--font-khand), sans-serif;
          font-weight: 600;
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

        /* --- About --- */
        .about-section {
          position: relative;
          z-index: 5;
          text-align: center;
          max-width: 900px;
          padding: 4rem 1.5rem;
          margin-top: 6rem;
        }

        .about-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 2rem;
          color: #000;
        }

        .about-content p {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          line-height: 1.6;
          color: #444;
          margin-bottom: 3rem;
          font-weight: 300;
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
          padding: 2rem 2rem 0 2rem; // Change to change the size of card size
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          height: 400px;
          transition: transform 0.3s ease;
          
          /* Force solid background handling */
          background-clip: padding-box;
          opacity: 1; 
          z-index: 10; /* Ensures it sits firmly on top of the grid */
          box-shadow: 0 4px 6px rgba(0,0,0,0.05); /* Optional: adds subtle depth */
          overflow: hidden;
          transition: transform 0.3s ease;
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
          margin-bottom: auto; /* Pushes image to bottom */
          max-width: 90%;
        }

        .card-img-container {
          width: 100%;
          /* Remove fixed height if it was limiting you, or keep it large enough */
          height: 160px; 
          
          display: flex;
          justify-content: center;
          align-items: flex-end; /* Aligns image to the very bottom line */
          
          /* Ensure it pushes to the bottom of the flex column */
          margin-top: auto; 
          
          /* Optional: A tiny negative margin pulls it down just a pixel 
             to ensure no hairline gap appears at the bottom */
          margin-bottom: -1px; 
        }

        /* Add this new class for the images */
        :global(.domain-icon) {
          object-fit: contain;
          /* This makes pixel art look crisp instead of blurry */
          image-rendering: pixelated;
          max-height: 100%;
          transition: transform 0.3s ease;
        }

        .domain-card:hover :global(.domain-icon) {
          transform: scale(1.1) rotate(-5deg); /* Adds a little pop on hover */
        }

        /* Temporary styling until you add real images */
        .temp-circle {
          width: 120px;
          height: 120px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
        }x

      `}</style>
    </main>
  );
}
