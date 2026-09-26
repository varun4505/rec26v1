"use client";

import React, { useRef } from "react";
import s from "./Landing.module.css";

const COL_W = 240;
const PAD_X = 40;
const AXIS_H = 44;
const ROW_H = 50;

const stages = ["Apply", "Round 1", "Round 2", "Interviews", "Results", "Onboard"];

type Bar = {
	label: string;
	sub: string;
	range?: string;
	from: number;
	to: number;
	variant?: "current" | "muted" | "faint";
};

// Mirrors the round structure in src/data/domainConfig.ts.
const bars: Bar[] = [
	{ label: "Recruitments ’25", sub: "VinnovateIT", range: "3 domains · 9 tracks", from: 0, to: 6, variant: "current" },
	{ label: "Apply", sub: "sign in with Google · pick a domain", from: 0, to: 1 },
	{ label: "Tech", sub: "Web · App · AI/ML", range: "questionnaire → task", from: 1, to: 3 },
	{ label: "Tech", sub: "CP · Cyber Security", range: "problems · CTF", from: 1, to: 2 },
	{ label: "Design", sub: "UI/UX · Graphics · Video", from: 1, to: 2 },
	{ label: "Management", sub: "task + questions", from: 1, to: 2 },
	{ label: "Interviews & results", sub: "shortlisted folks only", from: 3, to: 5, variant: "muted" },
	{ label: "Onboarding", sub: "welcome to the lab", from: 5, to: 6, variant: "faint" },
];

const trackWidth = PAD_X * 2 + stages.length * COL_W;
const trackHeight = AXIS_H + bars.length * ROW_H;

export default function Timeline() {
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

	const onPointerDown = (e: React.PointerEvent) => {
		if (e.pointerType !== "mouse" || !scrollRef.current) return;
		drag.current = { x: e.clientX, left: scrollRef.current.scrollLeft, moved: false };
	};
	const onPointerMove = (e: React.PointerEvent) => {
		const d = drag.current;
		const el = scrollRef.current;
		if (!d || !el) return;
		const dx = e.clientX - d.x;
		if (Math.abs(dx) > 4 && !d.moved) {
			d.moved = true;
			el.dataset.dragging = "true";
		}
		el.scrollLeft = d.left - dx;
	};
	const endDrag = () => {
		const el = scrollRef.current;
		if (el) delete el.dataset.dragging;
		// Keep `moved` around for the click that follows pointerup.
		window.setTimeout(() => (drag.current = null), 0);
	};

	return (
		<div className={s.timeline} id="pipeline">
			<section className={s.tl} aria-label="How recruitment works">
				<div
					ref={scrollRef}
					className={s.tlScroll}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={endDrag}
					onPointerLeave={endDrag}
					onClickCapture={(e) => {
						if (drag.current?.moved) {
							e.preventDefault();
							e.stopPropagation();
						}
					}}
				>
					<div className={s.tlTrack} style={{ width: trackWidth, height: trackHeight }}>
						<div className={s.tlAxis}>
							{stages.map((stage, i) => (
								<span key={stage} className={s.tlTick} style={{ left: PAD_X + i * COL_W + COL_W / 2 }}>
									<span className={s.tlTickNum}>{String(i + 1).padStart(2, "0")}</span> {stage}
								</span>
							))}
						</div>
						{Array.from({ length: stages.length + 1 }, (_, i) => (
							<span key={`g${i}`} className={s.tlGrid} style={{ left: PAD_X + i * COL_W }} />
						))}
						{Array.from({ length: stages.length }, (_, i) =>
							[1, 2, 3].map((q) => (
								<span
									key={`q${i}-${q}`}
									className={`${s.tlGrid} ${s.tlGridQ}`}
									style={{ left: PAD_X + i * COL_W + (q * COL_W) / 4 }}
								/>
							))
						)}
						{bars.map((bar, i) => {
							const variant =
								bar.variant === "current"
									? s.tlBarCurrent
									: bar.variant === "muted"
										? s.tlBarMuted
										: bar.variant === "faint"
											? `${s.tlBarMuted} ${s.tlBarFaint}`
											: "";
							return (
								<a
									key={`${bar.label}-${i}`}
									href="#domains"
									className={`${s.tlBar} ${variant}`}
									style={{
										left: PAD_X + bar.from * COL_W,
										width: (bar.to - bar.from) * COL_W,
										top: AXIS_H + i * ROW_H + 6,
									}}
								>
									<span className={s.tlBarMain}>
										<span className={s.tlBarLabel}>
											{bar.label}
											<span className={s.tlBarSub}>{bar.sub}</span>
										</span>
										{bar.range && <span className={s.tlBarRange}>({bar.range})</span>}
									</span>
								</a>
							);
						})}
					</div>
				</div>
				<p className={s.tlHint}>
					<span className={s.tlHintKey}>Recruitment pipeline</span> · drag to explore · bars link to
					the tracks
				</p>
			</section>
		</div>
	);
}
