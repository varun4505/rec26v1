import React from "react";
import ProjectShowcase from "./components/project_showcase";

const projects = [
	{
		id: 1,
		imageSource: "/temp_project_image.png",
		projectNumber: ".01",
		heading: "INNOVATE FOR IMPACT",
		about:
			"STEP INTO THE WORLD WHERE IDEAS IGNITE REVOLUTIONS! INNOVATE FOR IMPACT CHALLENGES YOU TO THINK LIKE ENTREPRENEURS DREAM BIG, SOLVE PRESSING PROBLEMS, AND CREATE SOLUTIONS THAT SPARK MEANINGFUL CHANGE FROM ENGINEERING SOLUTIONS FOR EDUCATION, HEALTHCARE, OR SOCIAL JUSTICE TO SUSTAINABLE BUSINESS MODELS. THIS TRACK EMPOWERS YOU TO CRAFT VENTURES THAT DON'T JUST SURVIVE BUT THRIVE, LEAVING A LEGACY OF IMPACT.",
		link: "#",
	},
	{
		id: 2,
		imageSource: "/temp_project_image.png",
		projectNumber: ".02",
		heading: "BUILD THE FUTURE",
		about:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut velit ad possimus molestiae amet ducimus error. Corrupti itaque veniam a cum saepe quibusdam quae eos distinctio temporibus repellat. Sunt, doloribus? Inventore laborum perspiciatis consectetur adipisicing elit.",
		link: "#",
	},
	{
		id: 3,
		imageSource: "/temp_project_image.png",
		projectNumber: ".03",
		heading: "DESIGN EXCELLENCE",
		about:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos blanditiis accusantium quisquam perspiciatis consectetur adipisicing elit. Ut velit ad possimus molestiae amet ducimus error. Corrupti itaque veniam a cum saepe quibusdam quae eos distinctio temporibus repellat.",
		link: "#",
	},
];

export default function LandingProjects() {
	return (
		<>
			<section className="w-full bg-[#FFFFFF]">
				<h2 className="about-title font-array">
					PROJECTS
				</h2>

				<div className="w-full">
				{projects.map((project) => (
					<React.Fragment key={project.id}>
						{/* projects */}
						<ProjectShowcase
							imageSource={project.imageSource}
							heading={project.heading}
							about={project.about}
							projectNumber={project.projectNumber}
							link={project.link}
						/>
						{/* spacing between the projects */}
						<div className="w-full h-[30vh]"></div>
					</React.Fragment>
				))}
			</div>
		</section>

		<style jsx>{`
			.font-array {
				font-family: var(--font-array), monospace;
			}

			.about-title {
				font-size: clamp(2.5rem, 5vw, 4rem);
				margin-bottom: 2rem;
				color: #000;
				text-align: center;
				padding: 3rem 0;
			}
		`}</style>
		</>
	);
}
