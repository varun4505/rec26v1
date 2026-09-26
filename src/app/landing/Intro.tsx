"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import s from "./Landing.module.css";
import { RECRUITMENT_HREF, projects } from "./data";
import { openTerminal } from "./events";

const projectHref = (id: string) => projects.find((p) => p.id === id)?.href ?? "#proof-of-build";

function LocalStamp() {
	const [now, setNow] = useState<{ time: string; zone: string } | null>(null);

	useEffect(() => {
		const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local";
		const fmt = new Intl.DateTimeFormat("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
		const tick = () => setNow({ time: fmt.format(new Date()), zone });
		tick();
		const id = window.setInterval(tick, 1000);
		return () => window.clearInterval(id);
	}, []);

	return (
		<time className={s.introStamp}>
			<span className={s.introStampTime}>{now?.time ?? "--:--:-- --"}</span>
			<span className={s.introStampSep}>·</span>
			<span className={s.introStampPlace}>{now?.zone ?? "local"}</span>
		</time>
	);
}

export default function Intro() {
	return (
		<section className={s.intro} id="top" aria-labelledby="intro-heading">
			<div className={s.introMain}>
				<h1 id="intro-heading" className={s.srOnly}>
					VinnovateIT Recruitments
				</h1>
				<p className={s.introLede}>
					<span className={`${s.introKey} ${s.introName}`}>VinnovateIT</span> is a{" "}
					<span className={s.introKey}>student-run tech space</span> for people who’d rather
					build than brainstorm forever. We turn random ideas into real products like{" "}
					<a href={projectHref("messit")} target="_blank" rel="noopener noreferrer">
						MessIT
					</a>
					,{" "}
					<a href={projectHref("latch")} target="_blank" rel="noopener noreferrer">
						Latch
					</a>{" "}
					and{" "}
					<a href={projectHref("bunkbuddies")} target="_blank" rel="noopener noreferrer">
						BunkBuddies
					</a>
					, run <span className={s.introKey}>VinHack</span>, and learn by doing:{" "}
					<span className={s.introKey}>ship first, overthink later.</span>
				</p>
				<p className={s.introNote}>
					No fluff, no gatekeeping. Just builders, creators, and late-night problem solvers across
					tech, design and management.
				</p>
			</div>

			<aside className={s.introReadout}>
				<p className={s.introMeta}>
					<LocalStamp />
				</p>
				<div className={s.introControls}>
					<button type="button" className={s.introControl} onClick={openTerminal}>
						<span className={s.introControlLabel}>Open terminal</span>
						<span className={s.introControlAccent} aria-hidden="true">
							&gt;<span className={s.hdrTerminalCursor}>_</span>
						</span>
					</button>
					<Link href={RECRUITMENT_HREF} prefetch={false} className={s.introControl}>
						<span className={`${s.introControlLabel} ${s.introUnderline}`}>Recruitments ’25</span>
						<span className={s.introArrow} aria-hidden="true">
							↗
						</span>
					</Link>
					<a href="mailto:vinnovateit@gmail.com" className={s.introControl}>
						<span className={`${s.introControlLabel} ${s.introUnderline}`}>Say hi</span>
						<span className={s.introArrow} aria-hidden="true">
							↗
						</span>
					</a>
				</div>
				<div className={s.introSignoff}>
					<Image
						src="/assets/images/vinnovateit_white.svg"
						alt=""
						width={84}
						height={27}
						aria-hidden="true"
					/>
				</div>
			</aside>
		</section>
	);
}
