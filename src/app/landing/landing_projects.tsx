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
			"Your personal menu spoiler so you can decide if breakfast is worth waking up for—or if it's a stay-in-bed-and-snack kind of morning 🍳🍫",
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
			"Think of Vinhack as the ultimate creativity marathon where you and your team of four dive into real-world problems to cook up genius solutions and turn caffeine into code.",
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
			"Because finding the perfect hostel roommate should be easy, not a lucky draw 🎰",
		link: "https://bunkbuddies.vinnovateit.com",
	},
];

export default function LandingProjects() {
	return (
		<section className="w-screen bg-[#FFFFFF]">
			<h2 className="about-title font-array text-center">Our Testimonials</h2>

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
