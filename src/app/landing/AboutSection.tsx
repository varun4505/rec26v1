"use client";

import React from "react";
import { motion } from "framer-motion";

export const AboutSection = () => {
	return (
		<>
			<section className="about-section" id="about">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6 }}
					className="flex flex-col items-center"
				>
					<h2 className="about-title font-array">About VinnovateIT</h2>
					<span className="about-tagline font-khand">Always in Build Mode</span>
					<div className="about-content">
						<p>
							VinnovateIT is a student-run tech space for people who’d rather
							build than brainstorm forever. We turn random ideas into real
							products, learn by doing, and ship first, overthink later. No
							fluff, no gatekeeping, just builders, creators, and late-night
							problem solvers.
						</p>
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="cta-button secondary"
					>
						Explore More
					</motion.button>
				</motion.div>
			</section>
		</>
	);
};
