import React from "react";
import s from "./landing/Landing.module.css";
import { landingFontVars } from "./landing/fonts";
import GarageHeader from "./landing/GarageHeader";
import Intro from "./landing/Intro";
import LabStage from "./landing/LabStage";
import Timeline from "./landing/Timeline";
import ProjectGrid from "./landing/ProjectGrid";
import DomainGrid from "./landing/DomainGrid";
import FilmStrip from "./landing/FilmStrip";
import ShowcaseBand from "./landing/ShowcaseBand";

export default function HomePage() {
	return (
		<div className={`${s.page} ${landingFontVars}`}>
			<a href="#proof-of-build" className={s.skip}>
				Skip to content
			</a>
			<GarageHeader />
			<div className={s.shell}>
				<Intro />
				<LabStage />
				<Timeline />
				<main>
					<ProjectGrid />
					<DomainGrid />
					<FilmStrip />
				</main>
				<ShowcaseBand />
			</div>
			<div style={{display: 'none'}} dangerouslySetInnerHTML={{__html: '<!-- 🚩 Stage 2 Flag {vinnovate_welcome} Clue: Visit /wrapper/gold.html for the next step -->'}} />
		</div>
	);
}
