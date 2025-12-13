"use client";

import React from "react";
import Image from "next/image";
import { motion, easeOut } from "framer-motion";

export default function DomainsSection() {
	const domainData = [
		{
			title: "Tech",
			subheading: "We compile Ideas into reality ",
			desc: "From apps to AI, we turn wild ideas into working tech. Less theory, more shipping. If debugging feels like therapy, welcome home.",
			bg: "#FFD4B2", // Peach
			img: "/assets/images/computer.png",
		},
		{
			title: "Design",
			subheading: "We make Tech Look Hot.",
			desc: "We design the wow behind the work, clean UI, smooth UX, and visuals that slap. If pixels spark joy, this is your zone.",
			bg: "#FFB6C1", // Pink
			img: "/assets/images/palette.png",
		},
		{
			title: "Management",
			subheading: "We run the show ",
			desc: "We plan, manage, and make things happen from VinHack to MessIT and everything in between. If you love strategy, people, and execution, you’ll fit right in.",
			bg: "#FFD4B2", // Peach
			img: "/assets/images/glasses.png",
		},
	];

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
				{domainData.map((domain, index) => (
					<motion.div
						key={index}
						className="domain-card"
						style={{ backgroundColor: domain.bg }}
						variants={cardVariants}
						whileHover={{ y: -10, transition: { duration: 0.3 } }}
					>
						<h3 className="card-title font-array">{domain.title}</h3>
						<span className="card-subtitle font-khand">
							{domain.subheading}
						</span>
						<p className="card-desc font-khand">{domain.desc}</p>
						<div className="card-img-container">
							<Image
								src={domain.img}
								alt={domain.title}
								width={200}
								height={200}
								className="domain-icon"
							/>
						</div>
					</motion.div>
				))}
			</motion.div>
		</section>
	);
}
