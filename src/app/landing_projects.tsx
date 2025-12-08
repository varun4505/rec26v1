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

export default function Landing_projects() {
	return (
		<section className="w-full border-2 border-black bg-[#FFFFFF]">
			<h2 className="w-full text-4xl text-black font-bold text-center py-12 font-array">
				PROJECTS
			</h2>

			<div className="w-full">
				{projects.map((project) => (
					<>
                        {/* projects */}
						<ProjectShowcase
							key={project.id}
							imageSource={project.imageSource}
							heading={project.heading}
							about={project.about}
							projectNumber={project.projectNumber}
							link={project.link}
						/>
                        {/* spacing between the projects */}
						<div className="w-full h-[30vh]"></div>
					</>
				))}
			</div>
		</section>
	);
}
