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
		<RecruitmentsClosedPage />
	);
}
