"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormsShell from "./components/FormsShell";

export default function FormsDomainSelection() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const initialDomain = (searchParams.get("domain") || "tech") as
		| "tech"
		| "design"
		| "management";
	const [selectedDomain, setSelectedDomain] = useState<
		"tech" | "design" | "management"
	>(initialDomain);
	const [selectedSubdomain, setSelectedSubdomain] = useState<string>("");

	const handleDomainChange = (domain: "tech" | "design" | "management") => {
		setSelectedDomain(domain);
		// Update URL without navigation
		const url = new URL(window.location.href);
		url.searchParams.set("domain", domain);
		router.replace(url.pathname + url.search);
	};

	const handleSubdomainSelect = (subdomain: string) => {
		setSelectedSubdomain(subdomain);
		// Convert subdomain to URL-friendly format (lowercase, replace spaces and slashes with hyphens)
		const urlSubdomain = subdomain.toLowerCase().replace(/[\s\/]+/g, "-");
		// Navigate to forms_domain_quiz with URL parameters for round 1
		router.push(
			`/forms_domain_quiz?domain=${selectedDomain}&subdomain=${urlSubdomain}&round=1`
		);
	};

	type DomainContent = {
		title: string;
		subtitle: string;
		description: string;
		subdomains: string[];
		color: string;
	};

	const domainContent: Record<"tech" | "design" | "management", DomainContent> =
		{
			tech: {
				title: "TECH",
				subtitle: "Building smarter ways to create.",
				description:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				subdomains: ["Web Development", "App Development", "AI/ML"],
				color: "[#F86800D9]",
			},
			design: {
				title: "DESIGN",
				subtitle: "Crafting experiences that speak for themselves.",
				description:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				subdomains: ["UI/UX Design", "Graphic Design", "Motion Graphics"],
				color: "[#F600159E]",
			},
			management: {
				title: "MANAGEMENT",
				subtitle: "Turning vision into motion.",
				description:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				subdomains: ["Event Management", "Marketing", "Content Writing"],
				color: "[#317BADE8]",
			},
		};

	return (
		<FormsShell>
			{/* personal info */}
			<div className="flex-col h-[20%] p-7">
				<div className="h-[10%]"></div>
				<h1 className="text-5xl">Hi Name</h1>
				<p className="opacity-55 text-2xl">
					firstname.surname2025.vitsutdent.ac.in
				</p>
			</div>

			{/* domain picker */}
			<div className="flex justify-center items-center h-[10%]">
				<div className="w-full max-w-[85%] sm:max-w-[500px]">
					<div className="flex bg-black rounded-full relative p-1">
						{/* Sliding background */}
						<div
							className={`absolute rounded-full transition-all duration-300 ease-in-out ${
								selectedDomain === "tech"
									? "bg-[#F86800D9] left-1"
									: selectedDomain === "design"
									? "bg-[#F600159E] left-[33.5%]"
									: "bg-[#317BADE8] left-[66%]"
							}`}
							style={{
								width: "32.5%",
								top: "4px",
								bottom: "4px",
							}}
						/>

						{/* Buttons container */}
						<div className="flex w-full">
							{(
								Object.keys(domainContent) as Array<
									"tech" | "design" | "management"
								>
							).map((domainKey) => (
								<button
									key={domainKey}
									onClick={() =>
										handleDomainChange(
											domainKey as "tech" | "design" | "management"
										)
									}
									className={`flex-1 py-1 rounded-full relative z-10 transition-colors duration-300
                                        text-sm sm:text-lg font-khand flex items-center justify-center font-medium
                                        ${
																					selectedDomain === domainKey
																						? `text-white bg-${domainContent[domainKey].color}`
																						: "text-white/70 hover:text-white"
																				}`}
								>
									<span className="inline-block">
										{domainContent[domainKey].title}
									</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col h-[70%] w-full">
				{/* domain */}
				<div className="flex justify-around items-center w-full h-1/2 just">
					{/* domain types */}
					<div className="flex flex-col justify-center items-center w-3/12 h-full text-center">
						<div className="text-8xl">
							{domainContent[selectedDomain].title}
						</div>
						<div className="text-3xl opacity-55">
							{domainContent[selectedDomain].subtitle}
						</div>
					</div>
					{/* domain description */}
					<div className="flex items-center justify-center h-full w-5/12">
						<p className="text-gray-800 px-4">
							{domainContent[selectedDomain].description}
						</p>
					</div>
				</div>

				{/* subdomains */}
				<div className="p-3 h-1/2">
					<div className="flex flex-col bg-[#F86800]/30 h-full w-full rounded-4xl p-7">
						<h3 className="text-3xl h-[40%]">Choose a subdomain</h3>
						<div className="flex flex-wrap gap-2 h-[60%]">
							{domainContent[selectedDomain].subdomains.map(
								(subdomain, index) => (
									<button
										key={index}
										onClick={() => handleSubdomainSelect(subdomain)}
										className={`flex-1 min-w-0 px-4 py-2 rounded-lg bg-${domainContent[selectedDomain].color} text-center text-2xl`}
									>
										{subdomain}
									</button>
								)
							)}
						</div>
					</div>
				</div>
			</div>
		</FormsShell>
	);
}
