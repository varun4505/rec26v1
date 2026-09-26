"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import s from "./Landing.module.css";
import { RECRUITMENT_HREF } from "./data";

const CMD = "join --vinnovateit --build-mode";
const CELLS = 24;
const PX = 8;

function usePixelField(canvasRef: React.RefObject<HTMLCanvasElement | null>, progress: React.RefObject<number>) {
	useEffect(() => {
		const canvas = canvasRef.current;
		const host = canvas?.parentElement;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !host || !ctx) return;
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let cols = 0;
		let rows = 0;
		let dpr = 1;
		let seeds = new Float32Array(0);
		let raf = 0;
		let last = 0;
		let visible = false;
		const pointer = { x: -1000, y: -1000 };

		const resize = () => {
			const rect = host.getBoundingClientRect();
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(rect.width * dpr);
			canvas.height = Math.round(rect.height * dpr);
			cols = Math.ceil(rect.width / PX);
			rows = Math.ceil(rect.height / PX);
			seeds = new Float32Array(cols * rows).map(() => Math.random());
		};

		const draw = (now: number) => {
			const t = now / 1000;
			const p = progress.current ?? 0;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const size = (PX - 2) * dpr;
			for (let r = 0; r < rows; r++) {
				// Pixels rise from the bottom edge as the command "runs".
				const rise = Math.max(0, r / rows - (1 - p * 0.6)) * 1.4 * p;
				for (let c = 0; c < cols; c++) {
					const seed = seeds[r * cols + c];
					const twinkle = 0.5 + 0.5 * Math.sin(t * (0.6 + seed * 1.8) + seed * 40);
					const d = Math.hypot(c - pointer.x, (r - pointer.y) * 1.2);
					const glow = Math.max(0, 1 - d / 10);
					const heat = Math.min(1, rise * seed + glow * glow);
					const alpha = 0.035 + twinkle * 0.035 + heat * 0.55;
					if (heat > 0.12) ctx.fillStyle = `rgba(248, 104, 0, ${alpha.toFixed(3)})`;
					else ctx.fillStyle = `rgba(125, 129, 135, ${alpha.toFixed(3)})`;
					ctx.fillRect(c * PX * dpr, r * PX * dpr, size, size);
				}
			}
		};

		const loop = (now: number) => {
			raf = requestAnimationFrame(loop);
			if (now - last < 1000 / 30) return;
			last = now;
			draw(now);
		};

		const onMove = (e: PointerEvent) => {
			const rect = host.getBoundingClientRect();
			pointer.x = (e.clientX - rect.left) / PX;
			pointer.y = (e.clientY - rect.top) / PX;
			if (reduceMotion) draw(performance.now());
		};
		const onLeave = () => {
			pointer.x = -1000;
			pointer.y = -1000;
		};

		resize();
		draw(performance.now());
		const ro = new ResizeObserver(() => {
			resize();
			draw(performance.now());
		});
		ro.observe(host);
		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible && !reduceMotion && !raf) raf = requestAnimationFrame(loop);
			if (!visible) {
				cancelAnimationFrame(raf);
				raf = 0;
			}
		});
		io.observe(host);
		host.addEventListener("pointermove", onMove);
		host.addEventListener("pointerleave", onLeave);
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			host.removeEventListener("pointermove", onMove);
			host.removeEventListener("pointerleave", onLeave);
		};
	}, [canvasRef, progress]);
}

export default function ShowcaseBand() {
	const bandRef = useRef<HTMLAnchorElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const progressRef = useRef(0);
	const [progress, setProgress] = useState(0);

	usePixelField(canvasRef, progressRef);

	useEffect(() => {
		let raf = 0;
		const update = () => {
			raf = 0;
			const el = bandRef.current;
			if (!el) return;
			const vh = window.innerHeight;
			const top = el.getBoundingClientRect().top;
			const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.7)));
			progressRef.current = p;
			setProgress(Math.round(p * 100) / 100);
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	const typed = CMD.slice(0, Math.round(progress * CMD.length));
	const pending = CMD.slice(typed.length);
	const filled = Math.round(progress * CELLS);
	const done = progress >= 1;

	return (
		<Link
			ref={bandRef}
			href={RECRUITMENT_HREF}
			prefetch={false}
			id="join"
			className={`${s.showcase} ${progress > 0 && !done ? s.showcaseFilling : ""}`}
		>
			<span className={s.srOnly}>Open Recruitments 2025</span>
			<canvas ref={canvasRef} className={s.showcasePixels} aria-hidden="true" />
			<span className={s.gsbTerm} aria-hidden="true">
				<span className={s.gsbCmdline}>
					<span className={s.gsbPrompt}>viit@lab ~ % </span>
					<span className={s.gsbCmd}>
						{typed}
						<span className={s.gsbCaret} />
						<span className={s.gsbPending}>{pending}</span>
					</span>
				</span>
				<span className={s.gsbStatus}>
					<span className={s.gsbBar}>
						{Array.from({ length: CELLS }, (_, i) => (
							<span key={i} className={`${s.gsbCell} ${i < filled ? s.gsbCellOn : ""}`} />
						))}
					</span>
					<span>{done ? "ready · click to run" : "scroll to run"}</span>
					<span className={s.gsbArrow}>{done ? "↵" : "↓"}</span>
				</span>
			</span>
		</Link>
	);
}
