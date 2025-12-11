"use client";

import React from "react";
import MainNavbar from "./landing/Navbar";
import { Hero } from "./landing/Hero";
import { BackgroundElements } from "./landing/BackgroundElements";
import { AboutSection } from "./landing/AboutSection";
import DomainsSection from "./landing/DomainsSection";
import LandingProjects from "./landing/landing_projects";

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

			{/* Domains Section */}
			<DomainsSection />

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
