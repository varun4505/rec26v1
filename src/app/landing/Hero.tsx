"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
      rotation: -6,
      x: -160,
      y: 80,
      scale: 0.75,
    },
    {
      src: "/assets/images/gallery/2.png",
      alt: "Lab Life",
      rotation: -3,
      x: -80,
      y: 40,
      scale: 0.9,
    },
    {
      src: "/assets/images/gallery/3.png",
      alt: "Core Team",
      rotation: 0,
      x: 0,
      y: 10,
      scale: 1.05,
    },
    {
      src: "/assets/images/gallery/4.png",
      alt: "Tech Talk",
      rotation: 3,
      x: 80,
      y: 40,
      scale: 0.9,
    },
    {
      src: "/assets/images/gallery/5.png",
      alt: "Fun Time",
      rotation: 6,
      x: 160,
      y: 80,
      scale: 0.75,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section" id="home">
        <h1 className="hero-title">
          <span className="hero-main-text">VinnovateIT</span>
          <span className="hero-subtitle">recruiting now</span>
        </h1>

        <a href="/dashboard" className="cta-button">
          LET&apos;S GO
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
                  "--final-scale": img.scale,
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
              {[...Array(50)].map((_, i) => (
                <span key={i} className="marquee-text font-array">
                  Develop. Deliver. Dream. Design. &nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>

          {/* Band 2: Ideas in motion (Khand Font) */}
          <div className="marquee-band band-2">
            <div className="marquee-track reverse">
              {[...Array(50)].map((_, i) => (
                <span key={i} className="marquee-text font-khand">
                  Ideas in motion. Always. &nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
