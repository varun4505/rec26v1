import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

interface ProjectShowcaseProps {
	leftImage: string;
	middleImage: string;
	rightImage: string;
	heading: string;
	about: string;
	projectNumber: string;
	link: string;
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
	leftImage,
	middleImage,
	rightImage,
	heading,
	about,
	projectNumber,
	link,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(containerRef, { once: true, amount: 0.3 });

	const isSvg = (src: string) => src.toLowerCase().endsWith(".svg");

	// Simple fade-in animation
	const fadeIn = {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: { duration: 0.6, ease: "easeOut" as const },
		},
	};

	return (
		<motion.div
			ref={containerRef}
			variants={fadeIn}
			initial="initial"
			animate={isInView ? "animate" : "initial"}
			className="relative z-5 text-center max-w-[900px] px-6 py-16 w-full mx-auto"
		>
			<div className="relative flex items-center justify-center w-full h-auto mb-8">
				{/* Left Image */}
				<div
					className="absolute left-1/2 w-24 h-24 sm:w-32 sm:h-32 md:w-52 md:h-52 rounded-full border-4 border-black overflow-hidden"
					style={{ transform: "translateX(-120%)" }}
				>
					{isSvg(leftImage) ? (
						<div className="w-full h-full bg-white flex items-center justify-center">
							<Image
								src={leftImage}
								alt="Project"
								width={120}
								height={120}
								className="w-3/4 h-3/4 object-contain"
							/>
						</div>
					) : (
						<Image
							src={leftImage}
							alt="Project"
							fill
							className="object-cover"
						/>
					)}
					<div className="absolute inset-0 bg-black rounded-full opacity-25"></div>
				</div>

				{/* Right Image */}
				<div
					className="absolute left-1/2 w-24 h-24 sm:w-32 sm:h-32 md:w-52 md:h-52 rounded-full border-4 border-black overflow-hidden"
					style={{ transform: "translateX(20%)" }}
				>
					{isSvg(rightImage) ? (
						<div className="w-full h-full bg-white flex items-center justify-center">
							<Image
								src={rightImage}
								alt="Project"
								width={120}
								height={120}
								className="w-3/4 h-3/4 object-contain"
							/>
						</div>
					) : (
						<Image
							src={rightImage}
							alt="Project"
							fill
							className="object-cover"
						/>
					)}
					<div className="absolute inset-0 bg-black rounded-full opacity-25"></div>
				</div>

				{/* Center Image */}
				<div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-64 md:h-64 rounded-full border-4 border-black overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.25)] z-10">
					{isSvg(middleImage) ? (
						<div className="w-full h-full bg-white flex items-center justify-center">
							<Image
								src={middleImage}
								alt="Project"
								width={120}
								height={120}
								className="w-3/4 h-3/4 object-contain"
							/>
						</div>
					) : (
						<Image
							src={middleImage}
							alt="Project"
							fill
							className="object-cover"
						/>
					)}
				</div>
			</div>

			{/* Project Info */}
			<div className="text-2xl sm:text-3xl lg:text-[2.5rem] mb-2 text-black font-normal font-khand">
				{projectNumber}
			</div>
			<h3 className="text-lg sm:text-xl lg:text-[2.3rem] mb-6 text-black font-medium font-khand">
				{heading}
			</h3>
			<p className="text-base sm:text-lg lg:text-[1.4rem] leading-relaxed text-[#444] mb-12 font-light font-khand">
				{about}
			</p>

			{/* CTA Button */}
			<div className="flex justify-center">
				<a
					href={link}
					className="inline-flex items-center justify-center gap-3 rounded-full font-khand leading-none transition-all duration-200 opacity-80 cursor-pointer border-none relative z-5 no-underline capitalize bg-linear-to-r from-[#ff9a5e] to-[#f86800] text-black font-semibold px-8 sm:px-12 py-2 sm:py-3 text-lg sm:text-2xl shadow-[0_4px_15px_rgba(248,104,0,0.2)] hover:scale-[1.03] active:scale-[0.98]"
				>
					Know More
				</a>
			</div>
		</motion.div>
	);
};
export default ProjectShowcase;
