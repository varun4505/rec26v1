import React from "react";
import Image from "next/image";

interface ProjectShowcaseProps {
	imageSource: string;
	heading: string;
	about: string;
	projectNumber: string;
	link: string;
}

const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
	imageSource,
	heading,
	about,
	projectNumber,
	link,
}) => {
	return (
		<div className="w-full py-8 text-black max-h-[70vh] flex flex-col justify-center">
			<div className="relative flex items-center justify-center w-full h-[35vh] mb-4">
				<div className="absolute left-1/2 -translate-x-[120%] w-[28vh] h-[28vh] rounded-full border-4 border-black overflow-hidden">
					<Image
						src={imageSource}
						alt="Project"
						fill
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-black opacity-25 rounded-full"></div>
				</div>
				<div className="absolute left-1/2 translate-x-[20%] w-[28vh] h-[28vh] rounded-full border-4 border-black overflow-hidden">
					<Image
						src={imageSource}
						alt="Project"
						fill
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-black opacity-25 rounded-full"></div>
				</div>
				<div className="relative w-[35vh] h-[35vh] rounded-full border-4 border-black overflow-hidden shadow-2xl">
					<Image
						src="/temp_project_image.png"
						alt="Project"
						fill
						className="object-cover"
					/>
				</div>
			</div>{" "}
			<div className="text-center text-4xl mb-2 font-khand font-normal">
				{projectNumber}
			</div>
			<div className="text-center text-2xl mb-3 font-khand font-medium">
				{heading}
			</div>
			<div className="text-center px-40 leading-relaxed font-khand">
				{about}
			</div>
			<div className="flex justify-center mt-4 font-normal font-khand">
				<a
					href={link}
					className="inline-flex items-center justify-center px-12 py-2 rounded-full bg-[#F86800] bg-opacity-66 hover:scale-105 transition-all duration-200 cursor-pointer"
					style={{
						filter: "drop-shadow(3px 0px 11.9px rgba(248, 104, 0, 0.3))",
					}}
				>
					Know More
				</a>
			</div>
		</div>
	);
};
export default ProjectShowcase;
