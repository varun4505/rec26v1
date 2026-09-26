"use client";

import React, { useEffect, useRef, useState } from "react";
import s from "./Landing.module.css";

// 20×24 pixel sprite, one character per pixel.
const SPRITE_MAP = [
	"....oo........oo....",
	"...osso......osso...",
	"....oooooooooooo....",
	"...ollllllllllllo...",
	"...offfffffffffso...",
	"...ofnffffffffnso...",
	"...ofnffffffffnso...",
	"...okfmmmmmmmmfko...",
	"...ofmmmnnnnmmmfo...",
	"...ofmmmmmmmmmmfo...",
	"..oossmmmmmmmmssoo..",
	"..ofoommmmmmmmoofo..",
	"..offfoooooooofffo..",
	".offffffffffffffffo.",
	".olffffbbbbbbffffso.",
	".olffppfbbbbfppffso.",
	".olffppfbbbbfppffso.",
	".olfffbbbbbbbbfffso.",
	"olffffbbbbbbbbffffso",
	"olffffbbbbbbbbffffso",
	"olfffffbbbbbbfffffso",
	"osffffffffffffffffso",
	".osppppffffffppppso.",
	"..oooooooooooooooo..",
];

const PALETTE: Record<string, string> = {
	o: "#3b2412", // outline
	f: "#b8692c", // fur
	l: "#d88a45", // lit fur
	s: "#8f4f1f", // shaded fur
	m: "#9b5626", // snout
	n: "#24160b", // eyes + nose
	b: "#c77936", // belly
	k: "#e89a7a", // blush
	p: "#7a4119", // paws + feet
};

type Rect = { x: number; y: number; w: number; h: number; fill: string; className?: string };

// Merge horizontal runs so the SVG stays small.
const BODY: Rect[] = SPRITE_MAP.flatMap((row, y) => {
	const rects: Rect[] = [];
	for (let x = 0; x < row.length; ) {
		const ch = row[x];
		let end = x + 1;
		while (end < row.length && row[end] === ch) end++;
		if (PALETTE[ch]) rects.push({ x, y, w: end - x, h: 1, fill: PALETTE[ch] });
		x = end;
	}
	return rects;
});

const EXTRAS: Rect[] = [
	// nose shine
	{ x: 9, y: 8, w: 1, h: 1, fill: "#4a2e1a" },
	// the orange on its head
	{ x: 8, y: 0, w: 4, h: 2, fill: "#f86800" },
	{ x: 9, y: 0, w: 1, h: 1, fill: "#ffb070" },
	{ x: 11, y: 0, w: 1, h: 2, fill: "#b84d00" },
	{ x: 9, y: -1, w: 1, h: 1, fill: "#5a3a1a" },
	{ x: 10, y: -1, w: 2, h: 1, fill: "#4f8a2b" },
	// eyelids, shown only mid-blink
	{ x: 5, y: 5, w: 1, h: 1, fill: PALETTE.f, className: "lid" },
	{ x: 14, y: 5, w: 1, h: 1, fill: PALETTE.f, className: "lid" },
];

const LINES = [
	"ok i pull up",
	"have you tried “help”?",
	"capy approves this PR",
	"ship first, nap later",
	"recruitments? i’m in.",
	"*contented capybara noises*",
	"i run on vibes + yuzu",
];

export default function Capybara() {
	const [line, setLine] = useState<string | null>(null);
	const [hops, setHops] = useState(0);
	const lastIndex = useRef(-1);
	const timer = useRef<number | undefined>(undefined);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	const onClick = () => {
		let i = Math.floor(Math.random() * LINES.length);
		if (i === lastIndex.current) i = (i + 1) % LINES.length;
		lastIndex.current = i;
		setLine(LINES[i]);
		setHops((h) => h + 1);
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setLine(null), 2600);
	};

	return (
		<div className={s.capy}>
			{line && (
				<span className={s.capyBubble} role="status">
					{line}
				</span>
			)}
			<button
				type="button"
				className={s.capyButton}
				onClick={onClick}
				aria-label="Pet the capybara"
				title="pet the capybara"
			>
				<svg
					key={hops}
					className={`${s.capySprite} ${hops ? s.capyHop : ""}`}
					viewBox="0 -1 20 25"
					width="84"
					height="105"
					shapeRendering="crispEdges"
					aria-hidden="true"
				>
					{[...BODY, ...EXTRAS].map((r, i) => (
						<rect
							key={i}
							x={r.x}
							y={r.y}
							width={r.w}
							height={r.h}
							fill={r.fill}
							className={r.className === "lid" ? s.capyLid : undefined}
						/>
					))}
				</svg>
			</button>
		</div>
	);
}
