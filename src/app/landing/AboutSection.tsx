import React from "react";

export const AboutSection = () => {
	return (
		<>
			<section className="about-section" id="about">
				<h2 className="about-title font-array">About VinnovateIT</h2>
				<span className="about-tagline font-khand">Always in Build Mode</span>
				<div className="about-content">
					<p>
						VinnovateIT is a student-run tech space for people who’d rather
						build than brainstorm forever. We turn random ideas into real
						products, learn by doing, and ship first, overthink later. No fluff,
						no gatekeeping, just builders, creators, and late-night problem
						solvers.
					</p>
				</div>
				<button className="cta-button secondary">Explore More</button>
			</section>
		</>
	);
};
