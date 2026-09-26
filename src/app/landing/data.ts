import { DOMAIN_CONFIG } from "@/data/domainConfig";

export const RECRUITMENT_HREF = "/recruitments_closed";

export const socialLinks = [
	{ label: "Instagram", href: "https://www.instagram.com/vinnovateit/" },
	{ label: "GitHub", href: "https://github.com/vinnovateit" },
	{ label: "LinkedIn", href: "https://www.linkedin.com/company/v-innovate-it" },
	{ label: "X / Twitter", href: "https://twitter.com/v_innovate_it" },
	{ label: "Email", href: "mailto:vinnovateit@gmail.com" },
	{ label: "vinnovateit.com", href: "https://vinnovateit.com/" },
];

export const sections = [
	{ id: "top", label: "Intro" },
	{ id: "lab", label: "Terminal" },
	{ id: "pipeline", label: "How recruitment works" },
	{ id: "proof-of-build", label: "Our projects" },
	{ id: "domains", label: "Domains" },
	{ id: "life", label: "Life at VinnovateIT" },
	{ id: "join", label: "Join us" },
];

export type Project = {
	id: string;
	kicker: string;
	name: string;
	logo: string;
	wideLogo?: boolean;
	chip?: string;
	about: string;
	tags: string[];
	href: string;
};

export const projects: Project[] = [
	{
		id: "messit",
		kicker: "01 App · Android",
		name: "MessIT",
		logo: "/projects/Messit.svg",
		chip: "Live",
		about:
			"More than a mess menu app, it's VinnovateIT's aura on campus. Our direct channel to every student, without WhatsApp groups or email spam. Just food, just reach.",
		tags: ["Android", "Play Store", "Campus-wide"],
		href: "https://play.google.com/store/apps/details?id=com.vinnovateit.messit",
	},
	{
		id: "latch",
		kicker: "02 App · Android",
		name: "Latch",
		logo: "/projects/redLogoLatch.svg",
		chip: "Live",
		about:
			"Tired of logging in repeatedly? Connect once and forget the hassle. Latch signs you in to hostel Wi-Fi automatically: no typing, no remembering, no friction.",
		tags: ["Android", "Play Store", "Hostel Wi-Fi"],
		href: "https://play.google.com/store/apps/details?id=com.vinnovateit.latch",
	},
	{
		id: "bunkbuddies",
		kicker: "03 Web · Platform",
		name: "BunkBuddies",
		logo: "/projects/BunkBuddiesLogo.svg",
		wideLogo: true,
		about:
			"Finding the perfect hostel roommate should be easy, not a lucky draw. BunkBuddies helped students find their people before everyone else decided it was a good idea. Built before it was cool.",
		tags: ["Web", "Roommates", "Hostel"],
		href: "https://bunkbuddies.vinnovateit.com",
	},
];

export const domains = [
	{
		id: "tech",
		kicker: "Track 01 · Technical",
		name: "Tech",
		tagline: "We compile ideas into reality.",
		about:
			"From apps to AI, we turn wild ideas into working tech. Less theory, more shipping. If debugging feels like therapy, welcome home.",
		tags: DOMAIN_CONFIG.technical.subdomains.map((s) => s.name),
		image: "/assets/images/computer.png",
	},
	{
		id: "design",
		kicker: "Track 02 · Design",
		name: "Design",
		tagline: "We make tech look hot.",
		about:
			"We design the wow behind the work: clean UI, smooth UX, and visuals that slap. If pixels spark joy, this is your zone.",
		tags: DOMAIN_CONFIG.design.subdomains.map((s) => s.name),
		image: "/assets/images/palette.png",
	},
	{
		id: "management",
		kicker: "Track 03 · Management",
		name: "Management",
		tagline: "We run the show.",
		about:
			"We plan, manage, and make things happen, from VinHack to MessIT and everything in between. If you love strategy, people, and execution, you'll fit right in.",
		tags: ["Events", "Strategy", "People", "Execution"],
		image: "/assets/images/glasses.png",
	},
];

export const gallery = [
	{ src: "/assets/images/gallery/1.png", label: "Team work" },
	{ src: "/assets/images/gallery/2.png", label: "Lab life" },
	{ src: "/assets/images/gallery/3.png", label: "Core team" },
	{ src: "/assets/images/gallery/4.png", label: "Tech talk" },
	{ src: "/assets/images/gallery/5.png", label: "Fun time" },
];
