"use client";

import React from "react";
import MainNavbar from "./components/Navbar";
import { Hero } from "./components/Hero";
import { BackgroundElements } from "./components/BackgroundElements";
import { AboutSection } from "./components/AboutSection";
import LandingProjects from "./landing_projects";

export default function HomePage() {
  return (
    <main className="home-wrapper">
      {/* Navbar placed specifically for this page */}
      <MainNavbar />
      
      {/* Background Elements */}
      <BackgroundElements />
      
      {/* Hero Component */}
      <Hero />
      
      {/* About Section */}
      <AboutSection />

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
      `}</style>
    </main>
  );
}
