"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import s from "./Landing.module.css";
import AsciiCanvas from "./AsciiCanvas";
import { RECRUITMENT_HREF, projects } from "./data";

export default function ProjectGrid() {
	const [chocoCount, setChocoCount] = useState(0);

	const handleChocoClick = (e: React.MouseEvent) => {
		// The emoji lives inside the MessIT card link; don't follow it.
		e.preventDefault();
		e.stopPropagation();
		if (chocoCount + 1 === 5) {
			window.location.href = "/cocoa/decoder.html";
			setChocoCount(0);
		} else {
			setChocoCount(chocoCount + 1);
		}
	};

	return (
		<section id="proof-of-build" className={s.band} aria-labelledby="projects-heading">
			<p className={s.bandKicker}>Proof of build · things we shipped</p>
			<h2 id="projects-heading" className={s.bandHeading}>
				Real products, used on campus every day. Built by people who were once exactly where
				you are.
			</h2>
			<div className={s.grid}>
				{projects.map((project) => (
					<a
						key={project.id}
						href={project.href}
						target="_blank"
						rel="noopener noreferrer"
						className={`${s.cell} ${s.cellActive}`}
					>
						<span className={s.kicker}>{project.kicker}</span>
						<div className={s.titleRow}>
							<span className={`${s.titleMark} ${project.wideLogo ? s.titleMarkWide : ""}`}>
								<Image src={project.logo} alt="" fill sizes="96px" />
							</span>
							<h3 className={s.title}>{project.name}</h3>
							{project.chip && (
								<span className={s.chip}>
									<span className={s.chipDot} />
									{project.chip}
								</span>
							)}
						</div>
						<p className={s.desc}>
							{project.about}
							{project.id === "messit" && (
								<>
									{" "}
									<span
										onClick={handleChocoClick}
										style={{ cursor: "pointer", userSelect: "none" }}
										title="Click me 5 times!"
									>
										🍫
									</span>
								</>
							)}
						</p>
						<div className={s.cellFoot}>
							<div className={s.tags}>
								{project.tags.map((tag) => (
									<span key={tag} className={s.tag}>
										{tag}
									</span>
								))}
							</div>
							<span className={s.arrow} aria-hidden="true">
								→
							</span>
						</div>
					</a>
				))}

				<Link href={RECRUITMENT_HREF} prefetch={false} className={`${s.cell} ${s.cellSoon}`}>
					<div className={s.soonShader}>
						<AsciiCanvas variant="ripple" className={s.soonCanvas} />
					</div>
					<span className={s.soonNum}>04</span>
					<span className={s.soonRule} />
					<span className={s.soonText}>your project, next</span>
					<span className={s.soonSub}>coming soon · join the team that builds it →</span>
				</Link>
			</div>
		</section>
	);
}
