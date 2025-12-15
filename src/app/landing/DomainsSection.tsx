"use client";

import React from "react";
import Image from "next/image";
import { motion, easeOut } from "framer-motion";

export default function DomainsSection() {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: easeOut,
			},
		},
	};

	return (
		<section className="domains-section" id="domains">
			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="domains-title font-array"
			>
				Domains
			</motion.h2>

			<motion.div
				className="domains-grid"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-50px" }}
			>
				{/* Tech Domain */}
				<motion.div
					className="domain-card"
					style={{ backgroundColor: "#FFD4B2" }}
					variants={cardVariants}
					whileHover={{ y: -10, transition: { duration: 0.3 } }}
				>
					<h3 className="card-title font-array">Tech</h3>
					<span className="card-subtitle font-khand">
						We compile Ideas into reality{" "}
					</span>
					<p className="card-desc font-khand">
						From apps to AI, we turn wild ideas into working tech. Less theory,
						more shipping. If debugging feels like therapy, welcome home.
					</p>
					<div className="card-img-container">
						<Image
							src="/assets/images/computer.png"
							alt="Tech"
							fill
							className="domain-icon tech-icon"
						/>
					</div>
				</motion.div>

				{/* Design Domain */}
				<motion.div
					className="domain-card"
					style={{ backgroundColor: "#FFB6C1" }}
					variants={cardVariants}
					whileHover={{ y: -10, transition: { duration: 0.3 } }}
				>
					<h3 className="card-title font-array">Design</h3>
					<span className="card-subtitle font-khand">
						We make Tech Look Hot.
					</span>
					<p className="card-desc font-khand">
						We design the wow behind the work, clean UI, smooth UX, and visuals
						that slap. If pixels spark joy, this is your zone.
					</p>
					<div className="card-img-container">
						<Image
							src="/assets/images/palette.png"
							alt="Design"
							fill
							className="domain-icon design-icon"
						/>
					</div>
				</motion.div>

				{/* Management Domain */}
				<motion.div
					className="domain-card"
					style={{ backgroundColor: "#FFD4B2" }}
					variants={cardVariants}
					whileHover={{ y: -10, transition: { duration: 0.3 } }}
				>
					<h3 className="card-title font-array">Management</h3>
					<span className="card-subtitle font-khand">We run the show </span>
					<p className="card-desc font-khand">
						We plan, manage, and make things happen from VinHack to MessIT and
						everything in between. If you love strategy, people, and execution,
						you’ll fit right in.
					</p>
					<div className="card-img-container">
						<Image
							src="/assets/images/glasses.png"
							alt="Management"
							fill
							className="domain-icon management-icon"
						/>
					</div>
				</motion.div>
			</motion.div>
		</section>
	);
}
