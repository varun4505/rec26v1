"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoArrowForward } from "react-icons/io5";

type GalleryImage = {
  src: string;
  alt: string;
  rotation: number;
  x: number;
  y: number;
  scale: number;
};

const DragCard: React.FC<{
  img: GalleryImage;
  zIndex: number;
  isSpread: boolean;
}> = ({ img, zIndex, isSpread }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--drag-x", "0px");
    el.style.setProperty("--drag-y", "0px");
    el.style.setProperty("--drag-scale", "1");
    el.style.touchAction = "none";
    el.style.transition = "transform 600ms cubic-bezier(.2,.9,.3,1)";
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    pointerIdRef.current = e.pointerId;
    startRef.current = { x: e.clientX, y: e.clientY };
    draggingRef.current = true;
    el.setPointerCapture(e.pointerId);
    el.style.transition = "none";
    el.style.setProperty("--drag-scale", "1.03");
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    if (!draggingRef.current) return;
    if (pointerIdRef.current !== e.pointerId) return;
    const start = startRef.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    el.style.setProperty("--drag-x", `${dx}px`);
    el.style.setProperty("--drag-y", `${dy}px`);
  };

  const release = (e?: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    draggingRef.current = false;
    pointerIdRef.current = null;
    startRef.current = null;
    el.style.transition = "transform 600ms cubic-bezier(.2,.9,.3,1)";
    el.style.setProperty("--drag-x", `0px`);
    el.style.setProperty("--drag-y", `0px`);
    el.style.setProperty("--drag-scale", "1");
    if (e && el.releasePointerCapture) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div
      ref={ref}
      className="gallery-card"
      style={
        {
          zIndex,
          ["--final-rot" as any]: `${img.rotation}deg`,
          ["--final-x" as any]: `${img.x}%`,
          ["--final-y" as any]: `${img.y}px`,
          ["--final-scale" as any]: img.scale,
        } as React.CSSProperties
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
    >
      <Image
        src={img.src}
        alt={img.alt}
        className="gallery-image"
        draggable={false}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
      />
    </div>
  );
};

export const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const galleryImages: GalleryImage[] = [
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

      <section className="gallery-section">
        <div className={`gallery-container ${isLoaded ? "spread" : ""}`}>
          {galleryImages.map((img, index) => (
            <DragCard
              key={index}
              img={img}
              zIndex={index === 2 ? 15 : 10}
              isSpread={isLoaded}
            />
          ))}
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-band band-1">
            <div className="marquee-track">
              {[...Array(50)].map((_, i) => (
                <span key={i} className="marquee-text font-array">
                  Develop. Deliver. Dream. Design.&nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>

          <div className="marquee-band band-2">
            <div className="marquee-track reverse">
              {[...Array(50)].map((_, i) => (
                <span key={i} className="marquee-text font-khand">
                  Ideas in motion. Always.&nbsp;&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
