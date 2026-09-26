"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import s from "./Landing.module.css";
import { gallery } from "./data";

const SPEED = 26; // px per second

type Frame = { key: string; src?: string; label: string; href?: string };

const frames: Frame[] = [
	...gallery.map((g) => ({ key: g.src, src: g.src, label: g.label })),
	{ key: "instagram", label: "more on instagram ↗", href: "https://www.instagram.com/vinnovateit/" },
];

export default function FilmStrip() {
	const sheetRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);
	const offset = useRef(0);
	const hovering = useRef(false);
	const drag = useRef<{ id: number; x: number; start: number; moved: boolean } | null>(null);
	const [developed, setDeveloped] = useState<Set<string>>(() => new Set());

	useEffect(() => {
		const sheet = sheetRef.current;
		const track = trackRef.current;
		if (!sheet || !track) return;
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		let last = performance.now();
		let visible = false;

		const wrap = () => {
			const half = track.scrollWidth / 2;
			if (!half) return;
			while (offset.current <= -half) offset.current += half;
			while (offset.current > 0) offset.current -= half;
		};

		const tick = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			if (!hovering.current && !drag.current && !reduceMotion) offset.current -= SPEED * dt;
			wrap();
			track.style.transform = `translate3d(${offset.current}px, 0, 0)`;
			raf = visible ? requestAnimationFrame(tick) : 0;
		};

		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible && !raf) {
				last = performance.now();
				raf = requestAnimationFrame(tick);
			}
		});
		io.observe(sheet);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
	}, []);

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		drag.current = { id: e.pointerId, x: e.clientX, start: offset.current, moved: false };
	};
	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const d = drag.current;
		if (!d || d.id !== e.pointerId) return;
		const dx = e.clientX - d.x;
		if (!d.moved && Math.abs(dx) > 5) {
			d.moved = true;
			sheetRef.current?.setPointerCapture(e.pointerId);
			if (sheetRef.current) sheetRef.current.dataset.dragging = "true";
		}
		if (d.moved) offset.current = d.start + dx;
	};
	const onPointerUp = () => {
		if (sheetRef.current) delete sheetRef.current.dataset.dragging;
		window.setTimeout(() => (drag.current = null), 0);
	};

	const toggle = (key: string) =>
		setDeveloped((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});

	const renderFrame = (frame: Frame, i: number, copy: boolean) => {
		const code = `${String(i).padStart(2, "0")}A`;
		const view = (
			<>
				<div className={s.psView}>
					{frame.src ? (
						<Image src={frame.src} alt={copy ? "" : frame.label} fill sizes="(max-width: 860px) 74vw, 360px" draggable={false} />
					) : (
						<span className={s.psHandle}>@vinnovateit</span>
					)}
					<span className={s.psDither} aria-hidden="true" />
				</div>
				<figcaption className={s.psMeta}>
					<span>{code}</span>
					<span>{frame.label}</span>
				</figcaption>
			</>
		);
		return (
			<figure
				key={`${copy ? "b" : "a"}-${frame.key}`}
				className={`${s.psFrame} ${frame.href ? s.psFrameLink : ""}`}
				data-developed={developed.has(frame.key) || undefined}
				aria-hidden={copy || undefined}
				onClick={frame.href ? undefined : () => toggle(frame.key)}
			>
				{frame.href ? (
					<a href={frame.href} target="_blank" rel="noopener noreferrer" tabIndex={copy ? -1 : undefined}>
						{view}
					</a>
				) : (
					view
				)}
			</figure>
		);
	};

	return (
		<section id="life" className={s.personal} aria-labelledby="life-heading">
			<p className={s.bandKicker}>Life at VinnovateIT · always in build mode</p>
			<h2 id="life-heading" className={s.bandHeading}>
				Build the interaction. Break it. Fix it at 2am. Ship it anyway. Here’s what that looks
				like.
			</h2>
			<div
				ref={sheetRef}
				className={s.psSheet}
				onPointerEnter={(e) => {
					if (e.pointerType === "mouse") hovering.current = true;
				}}
				onPointerLeave={() => {
					hovering.current = false;
					onPointerUp();
				}}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
				onClickCapture={(e) => {
					if (drag.current?.moved) {
						e.preventDefault();
						e.stopPropagation();
					}
				}}
			>
				<div className={s.psClip}>
					<div ref={trackRef} className={s.psTrack}>
						{frames.map((frame, i) => renderFrame(frame, i, false))}
						{frames.map((frame, i) => renderFrame(frame, i, true))}
					</div>
				</div>
			</div>
			<p className={s.personalCaption}>
				<span className={s.psHintHover}>drag to explore · hover to develop</span>
				<span className={s.psHintTap}>swipe · tap to develop</span>
			</p>
		</section>
	);
}
