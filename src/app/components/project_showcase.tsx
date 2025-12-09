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
		<>
			<div className="project-showcase">
				<div className="project-images">
					<div className="project-image-left">
						<Image
							src={imageSource}
							alt="Project"
							fill
							className="object-cover"
						/>
						<div className="image-overlay"></div>
					</div>
					<div className="project-image-right">
						<Image
							src={imageSource}
							alt="Project"
							fill
							className="object-cover"
						/>
						<div className="image-overlay"></div>
					</div>
					<div className="project-image-center">
						<Image
							src="/temp_project_image.png"
							alt="Project"
							fill
							className="object-cover"
						/>
					</div>
				</div>
				<div className="project-number">{projectNumber}</div>
				<h3 className="project-heading">{heading}</h3>
				<p className="project-about">{about}</p>
				<div className="project-cta">
					<a href={link} className="cta-button secondary">
						Know More
					</a>
				</div>
			</div>

			<style jsx>{`
				/* --- Buttons --- */
				.cta-button.secondary {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					gap: 12px;
					border-radius: 9999px;
					font-family: var(--font-khand), sans-serif;
					line-height: 1;
					transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
						box-shadow 0.2s ease;
					opacity: 80%;
					cursor: pointer;
					border: none;
					position: relative;
					z-index: 5;
					text-decoration: none;
					text-transform: capitalize;
					background: linear-gradient(90deg, #ff9a5e 0%, #f86800 100%);
					color: #000;
					font-weight: 600;
					padding: 0.8rem 3.5rem;
					box-shadow: 0 4px 15px rgba(248, 104, 0, 0.2);
					font-size: 1.4rem;
				}
				.cta-button.secondary:hover {
					transform: scale(1.05) translateY(-2px);
					box-shadow: 0 10px 30px rgba(248, 104, 0, 0.4);
				}
				.cta-button.secondary:active {
					transform: scale(0.95);
				}

				/* --- Project Showcase --- */
				.project-showcase {
					position: relative;
					z-index: 5;
					text-align: center;
					max-width: 900px;
					padding: 4rem 1.5rem;
					width: 100%;
					margin: 0 auto;
				}

				.project-images {
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 35vh;
					margin-bottom: 2rem;
				}

				.project-image-left {
					position: absolute;
					left: 50%;
					transform: translateX(-120%);
					width: 28vh;
					height: 28vh;
					border-radius: 50%;
					border: 4px solid #000;
					overflow: hidden;
				}

				.project-image-right {
					position: absolute;
					left: 50%;
					transform: translateX(20%);
					width: 28vh;
					height: 28vh;
					border-radius: 50%;
					border: 4px solid #000;
					overflow: hidden;
				}

				.image-overlay {
					position: absolute;
					inset: 0;
					background: black;
					opacity: 0.25;
					border-radius: 50%;
				}

				.project-image-center {
					position: relative;
					width: 35vh;
					height: 35vh;
					border-radius: 50%;
					border: 4px solid #000;
					overflow: hidden;
					box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
				}

				.project-number {
					font-size: clamp(1.5rem, 3vw, 2.5rem);
					margin-bottom: 0.5rem;
					color: #000;
					font-weight: 400;
					font-family: var(--font-khand), sans-serif;
				}

				.project-heading {
					font-size: clamp(1.3rem, 2.5vw, 1.8rem);
					margin-bottom: 1.5rem;
					color: #000;
					font-weight: 500;
					font-family: var(--font-khand), sans-serif;
				}

				.project-about {
					font-size: clamp(1.1rem, 2vw, 1.4rem);
					line-height: 1.6;
					color: #444;
					margin-bottom: 3rem;
					font-weight: 300;
					font-family: var(--font-khand), sans-serif;
				}

				.project-cta {
					display: flex;
					justify-content: center;
				}
			`}</style>
		</>
	);
};
export default ProjectShowcase;
