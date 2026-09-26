"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import s from "./Landing.module.css";

const WALK_SPEED = 26; // px per second; capybaras are in no hurry
const EDGE = 14; // keep this far from the ends of the monitor
const SPRITE_W = 128;
const SPRITE_H = 83;

const LINES = [
	"ok i pull up",
	"have you tried “help”?",
	"capy approves this PR",
	"ship first, nap later",
	"recruitments? i’m in.",
	"*contented capybara noises*",
	"i run on vibes + yuzu",
];

// Side-view capybara, drawn facing right on a 160×104 canvas.
// Legs are separate groups so they can swing in a diagonal walking gait:
// A = near front + far back, B = near back + far front.
function CapybaraArt({ uid }: { uid: string }) {
	const id = (name: string) => `${uid}-${name}`;
	const url = (name: string) => `url(#${id(name)})`;

	const hindLeg = "M36 72C36 66 52 66 54 72L52 94C52 97 50 99 47 99L41 99C38 99 36.5 97 37 94Z";
	const foreLeg = "M94 73C94 68 107 68 107 73L106 94C106 97 104 99 101 99L97.5 99C95 99 93.5 97 94 94Z";
	const hindToes = "M37 95H52V97.5C52 98.8 51 99.6 49.6 99.6H39.4C38 99.6 37 98.8 37 97.5Z";
	const foreToes = "M94 95H106V97.5C106 98.8 105 99.6 103.6 99.6H96.4C95 99.6 94 98.8 94 97.5Z";

	return (
		<svg
			className={s.capyArt}
			viewBox="0 0 160 104"
			width={SPRITE_W}
			height={SPRITE_H}
			aria-hidden="true"
		>
			<defs>
				<linearGradient id={id("fur")} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#b27646" />
					<stop offset="0.45" stopColor="#8f5a33" />
					<stop offset="1" stopColor="#664027" />
				</linearGradient>
				<radialGradient id={id("sheen")} cx="0.42" cy="0.12" r="0.62">
					<stop offset="0" stopColor="#e2ad76" stopOpacity="0.55" />
					<stop offset="1" stopColor="#e2ad76" stopOpacity="0" />
				</radialGradient>
				<linearGradient id={id("snout")} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#3e2413" stopOpacity="0" />
					<stop offset="1" stopColor="#3e2413" stopOpacity="0.72" />
				</linearGradient>
				<linearGradient id={id("leg")} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#87532f" />
					<stop offset="1" stopColor="#5b3821" />
				</linearGradient>
				<radialGradient id={id("yuzu")} cx="0.35" cy="0.35" r="0.72">
					<stop offset="0" stopColor="#ffc27a" />
					<stop offset="0.5" stopColor="#f86800" />
					<stop offset="1" stopColor="#b44800" />
				</radialGradient>
			</defs>

			{/* contact shadow */}
			<ellipse cx="82" cy="100.6" rx="60" ry="3.2" fill="#000" opacity="0.32" />

			{/* far-side legs, darker and slightly offset */}
			<g className={`${s.capyLeg} ${s.capyLegB}`}>
				<path d={foreLeg} fill="#4f301b" transform="translate(7 -1)" />
				<path d={foreToes} fill="#2b190d" transform="translate(7 -1)" />
			</g>
			<g className={`${s.capyLeg} ${s.capyLegA}`}>
				<path d={hindLeg} fill="#4f301b" transform="translate(9 -1)" />
				<path d={hindToes} fill="#2b190d" transform="translate(9 -1)" />
			</g>

			<g className={s.capyTorso}>
				{/* barrel body with a high, rounded rump */}
				<path
					d="M20 64C16 44 32 30 58 29C80 28 98 30 108 36C116 42 118 58 114 72C110 84 96 89 80 89H52C32 89 23 80 20 64Z"
					fill={url("fur")}
				/>
				<path
					d="M20 64C16 44 32 30 58 29C80 28 98 30 108 36C116 42 118 58 114 72C110 84 96 89 80 89H52C32 89 23 80 20 64Z"
					fill={url("sheen")}
				/>
				{/* coarse fur along the back and flank */}
				<path
					d="M34 38l3-2.4M46 33.5l3-2.2M58 31.5l3-2M70 31l3-2M82 31.5l3-2M94 33.5l3-2M28 50l3-2.2M42 44l3-2M56 41l3-2M70 40l3-2M84 41l3-2M36 62l3-1.8M52 56l3-1.8M68 54l3-1.8M86 56l3-1.8"
					stroke="#5c371e"
					strokeWidth="1.1"
					strokeLinecap="round"
					opacity="0.4"
				/>
				<path
					d="M40 36l2.5-2M64 34l2.5-2M88 35l2.5-2M50 47l2.5-2M76 46l2.5-2"
					stroke="#d9a371"
					strokeWidth="1"
					strokeLinecap="round"
					opacity="0.35"
				/>

				{/* big, boxy head with a deep blunt snout */}
				<path
					d="M100 40C104 30 112 25 124 24L140 25C148 26 153 31 154 39C155 47 155 55 151 61C147 66 138 67 128 66C120 65 113 68 110 74C104 70 99 58 100 40Z"
					fill={url("fur")}
				/>
				<path
					d="M136 25L140 25C148 26 153 31 154 39C155 47 155 55 151 61C147 66 138 67 132 66C134 52 134 36 136 25Z"
					fill={url("snout")}
				/>
				{/* jaw muscle and brow */}
				<path d="M126 51Q134 58 146 57" stroke="#4d2d18" strokeWidth="1.2" fill="none" opacity="0.35" />
				<path d="M118 31Q124 28.5 130 30.5" stroke="#5c371e" strokeWidth="1.3" fill="none" opacity="0.5" />

				{/* ear */}
				<g className={s.capyEar}>
					<ellipse cx="109" cy="26" rx="5" ry="6.4" fill="#6d4326" transform="rotate(-14 109 26)" />
					<ellipse cx="109.6" cy="27" rx="2.6" ry="3.8" fill="#3b2213" transform="rotate(-14 109.6 27)" />
				</g>

				{/* eye, set high on the head */}
				<g className={s.capyEye}>
					<ellipse cx="124" cy="35" rx="2.7" ry="2.5" fill="#120a05" />
					<circle cx="125" cy="34.1" r="0.85" fill="#fff" opacity="0.85" />
				</g>

				{/* nostril, mouth, whiskers */}
				<path d="M148.5 37.2q2.6.4 3.6 3" stroke="#150c06" strokeWidth="1.7" strokeLinecap="round" fill="none" />
				<path d="M150.5 60q-3.4 2.6-8.5 2" stroke="#2a170c" strokeWidth="1.3" strokeLinecap="round" fill="none" />
				<path
					d="M146 48.5l10-2.5M146.5 50.5l10 .5M146 52.5l9 2.6"
					stroke="#241409"
					strokeWidth="0.6"
					strokeLinecap="round"
					opacity="0.5"
				/>

				{/* the yuzu */}
				<path d="M117.6 11.8v-2.4" stroke="#5a3a1a" strokeWidth="1.3" strokeLinecap="round" />
				<path d="M118 11q4.2-5.2 9.4-3.2q-4.2 4.4-9.4 3.2z" fill="#4f8a2b" />
				<circle cx="118" cy="17.6" r="6.6" fill={url("yuzu")} />
			</g>

			{/* near-side legs */}
			<g className={`${s.capyLeg} ${s.capyLegA}`}>
				<path d={foreLeg} fill={url("leg")} />
				<path d={foreToes} fill="#301b0e" />
			</g>
			<g className={`${s.capyLeg} ${s.capyLegB}`}>
				<path d={hindLeg} fill={url("leg")} />
				<path d={hindToes} fill="#301b0e" />
			</g>
		</svg>
	);
}

export default function Capybara() {
	const uid = useId().replace(/:/g, "");
	const rootRef = useRef<HTMLDivElement | null>(null);
	const hold = useRef(false);
	const lastIndex = useRef(-1);
	const timer = useRef<number | undefined>(undefined);
	const [line, setLine] = useState<string | null>(null);
	const [hops, setHops] = useState(0);
	const [dir, setDir] = useState<1 | -1>(-1);
	const [walking, setWalking] = useState(false);

	// Patrol the top of the monitor: walk to a random spot, pause, repeat.
	useEffect(() => {
		const el = rootRef.current;
		const cab = el?.parentElement;
		if (!el || !cab) return;

		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const minX = EDGE;
		let maxX = EDGE;
		const measure = () => {
			maxX = Math.max(minX, cab.offsetWidth - el.offsetWidth - EDGE);
		};
		measure();

		let x = Math.max(minX, maxX - 60);
		let target = x;
		let idleUntil = performance.now() + 1500;
		let curDir: 1 | -1 = -1;
		let curWalking = false;
		let raf = 0;
		let last = performance.now();

		const place = () => {
			el.style.transform = `translate3d(${x}px, 0, -24px)`;
		};
		place();

		const pickTarget = () => {
			const span = maxX - minX;
			let t = minX + Math.random() * span;
			if (span > 160 && Math.abs(t - x) < 80) t = x > minX + span / 2 ? minX + Math.random() * 40 : maxX - Math.random() * 40;
			return t;
		};

		const tick = (now: number) => {
			raf = requestAnimationFrame(tick);
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;

			const moving = !hold.current && now >= idleUntil && Math.abs(target - x) > 0.5;
			if (moving) {
				const d: 1 | -1 = target > x ? 1 : -1;
				x += d * Math.min(Math.abs(target - x), WALK_SPEED * dt);
				place();
				if (d !== curDir) {
					curDir = d;
					setDir(d);
				}
				if (Math.abs(target - x) <= 0.5) {
					idleUntil = now + 1400 + Math.random() * 3600;
					target = pickTarget();
				}
			} else if (!hold.current && now >= idleUntil) {
				target = pickTarget();
			}
			if (moving !== curWalking) {
				curWalking = moving;
				setWalking(moving);
			}
		};

		const start = () => {
			if (reduceMotion || raf) return;
			last = performance.now();
			raf = requestAnimationFrame(tick);
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
			if (curWalking) {
				curWalking = false;
				setWalking(false);
			}
		};

		const ro = new ResizeObserver(() => {
			measure();
			x = Math.min(Math.max(x, minX), maxX);
			target = Math.min(Math.max(target, minX), maxX);
			place();
		});
		ro.observe(cab);

		const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
		io.observe(el);

		return () => {
			stop();
			ro.disconnect();
			io.disconnect();
		};
	}, []);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	const onClick = () => {
		let i = Math.floor(Math.random() * LINES.length);
		if (i === lastIndex.current) i = (i + 1) % LINES.length;
		lastIndex.current = i;
		setLine(LINES[i]);
		setHops((h) => h + 1);
		hold.current = true;
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			setLine(null);
			hold.current = false;
		}, 2600);
	};

	return (
		<div ref={rootRef} className={`${s.capy} ${walking ? s.capyWalking : ""}`}>
			{line && (
				<span className={s.capyBubble} role="status">
					{line}
				</span>
			)}
			<button
				type="button"
				className={s.capyButton}
				onClick={onClick}
				onPointerEnter={() => (hold.current = true)}
				onPointerLeave={() => {
					if (!line) hold.current = false;
				}}
				aria-label="Pet the capybara"
				title="pet the capybara"
			>
				<span className={s.capyFlip} data-dir={dir === -1 ? "left" : "right"}>
					<span key={hops} className={`${s.capyBody} ${hops ? s.capyHop : ""}`}>
						<CapybaraArt uid={uid} />
					</span>
				</span>
			</button>
		</div>
	);
}
