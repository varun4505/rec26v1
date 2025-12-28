"use client";

import React from "react";
import Link from "next/link";
import MainNavbar from "./landing/Navbar";
import { Hero } from "./landing/Hero";
import { BackgroundElements } from "./landing/BackgroundElements";
import { AboutSection } from "./landing/AboutSection";
import DomainsSection from "./landing/DomainsSection";
import LandingProjects from "./landing/landing_projects";
import RecruitmentsClosedPage from "./recruitments_closed/recruitments_closed_page";

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

			<section id="testimonial" className="w-full flex flex-col items-center">
				<LandingProjects />
				<div className="w-full flex justify-center py-10">
					<Link
						href="https://vinnovateit.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="explore-btn"
					>
						See more things we do
					</Link>
				</div>
				<div style={{display: 'none'}} dangerouslySetInnerHTML={{__html: '<!-- 🚩 Stage 2 Flag {vinnovate_welcome} Clue: Visit /wrapper/gold.html for the next step -->'}} />
			</section>

			<div className="h-20"></div>

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
