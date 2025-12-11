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
		<div className="relative z-5 text-center max-w-[900px] px-6 py-16 w-full mx-auto">
			<div className="relative flex items-center justify-center w-full h-[35vh] mb-8">
				{/* Left Image */}
				<div className="absolute left-1/2 -translate-x-[120%] w-[28vh] h-[28vh] rounded-full border-4 border-black overflow-hidden">
					<Image
						src={imageSource}
						alt="Project"
						fill
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-black rounded-full opacity-25"></div>
				</div>

				{/* Right Image */}
				<div className="absolute left-1/2 translate-x-[20%] w-[28vh] h-[28vh] rounded-full border-4 border-black overflow-hidden">
					<Image
						src={imageSource}
						alt="Project"
						fill
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-black rounded-full opacity-25"></div>
				</div>

				{/* Center Image */}
				<div className="relative w-[35vh] h-[35vh] rounded-full border-4 border-black overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.25)]">
					<Image
						src="/temp_project_image.png"
						alt="Project"
						fill
						className="object-cover"
					/>
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
					className="inline-flex items-center justify-center gap-3 rounded-full font-khand leading-none transition-all duration-200 opacity-80 cursor-pointer border-none relative z-5 no-underline capitalize bg-gradient-to-r from-[#ff9a5e] to-[#f86800] text-black font-semibold px-14 py-3 text-2xl shadow-[0_4px_15px_rgba(248,104,0,0.2)] hover:scale-105 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(248,104,0,0.4)] active:scale-95"
				>
					Know More
				</a>
			</div>
		</div>
	);
};
export default ProjectShowcase;
