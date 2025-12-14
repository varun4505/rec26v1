"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const projects = [
	{
		id: 1,
		mainImage: "/projects/Messit.svg",
		projectNumber: ".01",
		heading: "MessIT",
		about:
			"MessIt is more than a mess menu app, it's VinnovateIT's aura on campus. Our direct channel to every student, without WhatsApp groups or email spam Just food, just reach.",
		link: "https://play.google.com/store/apps/details?id=com.vinnovateit.messit",
	},
	{
		id: 2,
		mainImage: "/projects/redLogoLatch.svg",
		projectNumber: ".02",
		heading: "Latch",
		about:
			"Tired of logging in repeatedly? With Latch, you connect once and forget the hassle. The app automatically signs you in to your hostel WiFi - no typing, no remembering, no friction.",
		link: "https://play.google.com/store/apps/details?id=com.vinnovateit.latch",
	},
	{
		id: 3,
		mainImage: "/projects/BunkBuddiesLogo.svg",
		projectNumber: ".03",
		heading: "BunkBuddies",
		about:
			"Because finding the perfect hostel roommate should be easy, not a lucky draw. Before it became a trend, it was BunkBuddies. Built by VinnovateIT, this roommate-finding app helped students find their people before everyone else decided it was a good idea.\nBuilt before it was cool.",
		link: "https://bunkbuddies.vinnovateit.com",
	},
];

const isSvg = (src: string) => src.toLowerCase().endsWith(".svg");

export default function LandingProjects() {
	const containerRef = useRef<HTMLDivElement>(null);
	const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
	const textsRef = useRef<(HTMLDivElement | null)[]>([]);

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			const mm = gsap.matchMedia();

			mm.add("(min-width: 640px)", () => {
				// Desktop/Tablet Animation
				setupAnimation(-160, 60);
			});

			mm.add("(max-width: 639px)", () => {
				// Mobile Animation (reduced spread)
				setupAnimation(-130, 30);
			});

			function setupAnimation(leftX: number, rightX: number) {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: containerRef.current,
						start: "top top",
						end: "+=300%",
						scrub: 1,
						pin: true,
						invalidateOnRefresh: true,
					},
				});

				const leftState = {
					xPercent: leftX,
					yPercent: -50,
					scale: 0.6,
					zIndex: 0,
					opacity: 0.6,
					filter: "blur(2px)",
				};
				const centerState = {
					xPercent: -50,
					yPercent: -50,
					scale: 1,
					zIndex: 10,
					opacity: 1,
					filter: "blur(0px)",
				};
				const rightState = {
					xPercent: rightX,
					yPercent: -50,
					scale: 0.6,
					zIndex: 0,
					opacity: 0.6,
					filter: "blur(2px)",
				};

				// Clear any existing transforms first to ensure clean slate
				gsap.set(imagesRef.current, { clearProps: "all" });

				// Initial text states
				gsap.set(textsRef.current[0], { autoAlpha: 1, y: 0 });
				gsap.set([textsRef.current[1], textsRef.current[2]], {
					autoAlpha: 0,
					y: 50,
				});

				// Step 1
				tl.addLabel("step1")
					// Image 0: Center -> Right
					.fromTo(
						imagesRef.current[0],
						centerState,
						{ ...rightState, duration: 1 },
						"step1"
					)
					// Image 1: Left -> Center
					.fromTo(
						imagesRef.current[1],
						leftState,
						{ ...centerState, duration: 1 },
						"step1"
					)
					// Image 2: Right -> Left (Back)
					.fromTo(
						imagesRef.current[2],
						{ ...rightState, zIndex: -1 },
						{ ...leftState, zIndex: -1, duration: 1 },
						"step1"
					)

					.to(
						textsRef.current[0],
						{ autoAlpha: 0, y: -50, duration: 0.5 },
						"step1"
					)
					.to(
						textsRef.current[1],
						{ autoAlpha: 1, y: 0, duration: 0.5 },
						"step1+=0.5"
					);

				// Step 2
				tl.addLabel("step2")
					.fromTo(
						imagesRef.current[0],
						{ ...rightState, zIndex: -1 },
						{ ...leftState, zIndex: -1, duration: 1 },
						"step2"
					)
					.to(imagesRef.current[1], { ...rightState, duration: 1 }, "step2")
					.to(imagesRef.current[2], { ...centerState, duration: 1 }, "step2")

					.to(
						textsRef.current[1],
						{ autoAlpha: 0, y: -50, duration: 0.5 },
						"step2"
					)
					.to(
						textsRef.current[2],
						{ autoAlpha: 1, y: 0, duration: 0.5 },
						"step2+=0.5"
					);
			}
		}, containerRef);
		return () => ctx.revert();
	}, []);

	return (
		<div className="w-full min-h-screen" id="proof-of-build">
			<motion.h2
				initial={{ opacity: 0, y: -20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="w-full text-center py-6 sm:py-10 about-title font-array text-3xl sm:text-5xl z-20 shrink-0"
			>
				Our Projects
			</motion.h2>
			<section
				ref={containerRef}
				className="w-screen h-screen flex flex-col items-center overflow-hidden relative pt-32"
			>
				<div className="flex-1 w-full max-w-[1000px] flex flex-col items-center justify-center min-h-0 pb-4">
					{/* Images Container */}
					<div className="relative w-full h-[180px] sm:h-[260px] mb-2 sm:mb-4 shrink-0">
						{projects.map((project, i) => (
							<div
								key={project.id}
								ref={(el) => {
									imagesRef.current[i] = el;
								}}
								className="absolute left-1/2 top-1/2 w-28 h-28 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full border-4 border-black overflow-hidden bg-white shadow-[0_25px_50px_rgba(0,0,0,0.25)] flex items-center justify-center"
							>
								{isSvg(project.mainImage) ? (
									<div className="w-full h-full bg-white flex items-center justify-center">
										<Image
											src={project.mainImage}
											alt={project.heading}
											width={150}
											height={150}
											className="w-3/4 h-3/4 object-contain"
										/>
									</div>
								) : (
									<Image
										src={project.mainImage}
										alt={project.heading}
										fill
										className="object-cover"
									/>
								)}
							</div>
						))}
					</div>

					{/* Text Container */}
					<div className="relative w-full grid grid-cols-1">
						{projects.map((project, i) => (
							<div
								key={project.id}
								ref={(el) => {
									textsRef.current[i] = el;
								}}
								className="col-start-1 row-start-1 flex flex-col items-center text-center px-4 sm:px-6"
							>
								<div className="text-xl sm:text-3xl lg:text-[2.5rem] mb-1 sm:mb-2 text-black font-normal font-khand">
									{project.projectNumber}
								</div>
								<h3 className="text-lg sm:text-xl lg:text-[2.3rem] mb-2 sm:mb-4 text-black font-medium font-khand">
									{project.heading}
								</h3>
								<p className="text-sm sm:text-lg lg:text-[1.4rem] leading-relaxed text-[#444] mb-4 sm:mb-6 font-light font-khand whitespace-pre-line max-w-[800px]">
									{project.about}
								</p>
								<div className="flex justify-center pb-4">
									<a
										href={project.link}
										className="inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full font-khand leading-none transition-all duration-200 opacity-80 cursor-pointer border-none relative z-5 no-underline capitalize bg-linear-to-r from-[#ff9a5e] to-[#f86800] text-black font-semibold px-6 sm:px-12 py-2 sm:py-3 text-base sm:text-2xl shadow-[0_4px_15px_rgba(248,104,0,0.2)] hover:scale-[1.03] active:scale-[0.98]"
									>
										Know More
									</a>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
