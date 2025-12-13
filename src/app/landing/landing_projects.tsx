import React from "react";
import ProjectShowcase from "../components/project_showcase";

const projects = [
	{
		id: 1,
		leftImage: "/projects/VinHack_logo.svg",
		middleImage: "/projects/Messit.svg",
		rightImage: "/projects/BunkBuddiesLogo.svg",
		projectNumber: ".01",
		heading: "MessIT",
		about:
			"MessIt is more than a mess menu app, it's VinnovateIT's aura on campus. Our direct channel to every student, without WhatsApp groups or email spam Just food, just reach.",
		link: "https://play.google.com/store/apps/details?id=com.vinnovateit.messit",
	},
	{
		id: 2,
		leftImage: "/projects/BunkBuddiesLogo.svg",
		middleImage: "/projects/VinHack_logo.svg",
		rightImage: "/projects/Messit.svg",
		projectNumber: ".02",
		heading: "Vinhack",
		about:
			"Once a year, Gravitas hands us the chaos. VinHack is VinnovateIT's flagship 36-hour inter-college hackathon, where the clock is louder than the doubts.\n\nJoin the chaos, we'll handle the clock",
		link: "https://vinhack.vinnovateit.com",
	},
	{
		id: 3,
		leftImage: "/projects/Messit.svg",
		middleImage: "/projects/BunkBuddiesLogo.svg",
		rightImage: "/projects/VinHack_logo.svg",
		projectNumber: ".03",
		heading: "BunkBuddies",
		about:
			"Because finding the perfect hostel roommate should be easy, not a lucky draw 🎰Before it became a trend, it was BunkBuddies. Built by VinnovateIT, this roommate-finding app helped students find their people before everyone else decided it was a good idea.\n\nBuilt before it was cool.",
		link: "https://bunkbuddies.vinnovateit.com",
	},
];

export default function LandingProjects() {
	return (
		<section className="w-screen bg-[#FFFFFF]" id="proof-of-build">
			<h2 className="about-title font-array text-center">Proof of Build</h2>

			<div className="w-full">
				{projects.map((project) => (
					<React.Fragment key={project.id}>
						{/* projects */}
						<ProjectShowcase
							leftImage={project.leftImage}
							middleImage={project.middleImage}
							rightImage={project.rightImage}
							heading={project.heading}
							about={project.about}
							projectNumber={project.projectNumber}
							link={project.link}
						/>
						{/* spacing between the projects (slightly tighter) */}
						<div className="w-full h-12 sm:h-16 lg:h-20"></div>
					</React.Fragment>
				))}
			</div>
		</section>
	);
}
