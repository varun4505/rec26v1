"use client";

import React, { useEffect, useRef } from "react";

type Variant = "field" | "ripple";

type VariantSpec = {
	cellW: number;
	cellH: number;
	fontSize: number;
	fps: number;
	glyphs: string;
	colors: string[];
	sample: (col: number, row: number, t: number, ctx: SampleCtx) => number;
};

type SampleCtx = { cols: number; rows: number; px: number; py: number };

// Each variant maps a cell to an intensity in [0, 1]; the intensity picks
// both the glyph and its color bucket from a pre-rendered atlas.
const VARIANTS: Record<Variant, VariantSpec> = {
	field: {
		cellW: 9,
		cellH: 15,
		fontSize: 11,
		fps: 20,
		glyphs: " .·:-=+*#%@",
		colors: [
			"#2a2826",
			"#3a342d",
			"#4d4033",
			"#6b4a2a",
			"#8f5520",
			"#b85e14",
			"#f86800",
			"#ffc285",
		],
		sample(col, row, t, { cols, rows, px, py }) {
			const x = col / cols;
			const y = row / rows;
			const plasma =
				Math.sin(col * 0.11 + t * 0.6) +
				Math.sin(row * 0.23 - t * 0.45) +
				Math.sin((col + row) * 0.06 + t * 0.3) +
				Math.sin(Math.hypot(col - cols / 2, row * 1.8) * 0.12 - t * 0.8);
			let v = (plasma + 4) / 8;
			// A soft lamp above the monitor, fading towards the edges.
			const lamp = Math.max(0, 1 - Math.hypot((x - 0.5) * 1.6, (y - 0.15) * 1.4));
			v = v * 0.35 + lamp * 0.45 * v + lamp * 0.12;
			const dx = col - px;
			const dy = (row - py) * 1.7;
			const glow = Math.max(0, 1 - Math.hypot(dx, dy) / 14);
			v += glow * glow * 0.55;
			return v;
		},
	},
	ripple: {
		cellW: 15,
		cellH: 15,
		fontSize: 10,
		fps: 30,
		glyphs: "?",
		colors: [
			"#221b02",
			"#3a2a04",
			"#624706",
			"#8f5909",
			"#c98a1c",
			"#f3bd44",
			"#f9d79e",
			"#fffefd",
		],
		sample(col, row, t, { cols, rows, px, py }) {
			const cx = px > -1000 ? px : cols / 2;
			const cy = py > -1000 ? py : rows / 2;
			const d = Math.hypot(col - cx, (row - cy) * 1.1);
			const wave = Math.sin(d * 0.55 - t * 2.4);
			const falloff = Math.exp(-d * 0.045);
			return Math.max(0, wave) * falloff * 1.1 + 0.04;
		},
	},
};

export default function AsciiCanvas({
	variant,
	className,
}: {
	variant: Variant;
	className?: string;
}) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const host = canvas?.parentElement;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !host || !ctx) return;

		const spec = VARIANTS[variant];
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const atlas = document.createElement("canvas");
		const atlasCtx = atlas.getContext("2d");
		if (!atlasCtx) return;

		let dpr = 1;
		let cols = 0;
		let rows = 0;
		let raf = 0;
		let visible = false;
		let last = 0;
		const start = performance.now();
		const pointer = { x: -10000, y: -10000 };

		const buildAtlas = () => {
			const family = getComputedStyle(canvas).fontFamily || "monospace";
			const cw = Math.ceil(spec.cellW * dpr);
			const ch = Math.ceil(spec.cellH * dpr);
			atlas.width = cw * spec.glyphs.length;
			atlas.height = ch * spec.colors.length;
			atlasCtx.clearRect(0, 0, atlas.width, atlas.height);
			atlasCtx.font = `${spec.fontSize * dpr}px ${family}`;
			atlasCtx.textAlign = "center";
			atlasCtx.textBaseline = "middle";
			spec.colors.forEach((color, r) => {
				atlasCtx.fillStyle = color;
				for (let g = 0; g < spec.glyphs.length; g++) {
					atlasCtx.fillText(spec.glyphs[g], g * cw + cw / 2, r * ch + ch / 2);
				}
			});
		};

		const resize = () => {
			const rect = host.getBoundingClientRect();
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(rect.width * dpr);
			canvas.height = Math.round(rect.height * dpr);
			cols = Math.ceil(rect.width / spec.cellW);
			rows = Math.ceil(rect.height / spec.cellH);
			buildAtlas();
		};

		const draw = (now: number) => {
			const t = (now - start) / 1000;
			const cw = Math.ceil(spec.cellW * dpr);
			const ch = Math.ceil(spec.cellH * dpr);
			const glyphCount = spec.glyphs.length;
			const colorCount = spec.colors.length;
			const sampleCtx = { cols, rows, px: pointer.x, py: pointer.y };
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const v = Math.min(1, Math.max(0, spec.sample(col, row, t, sampleCtx)));
					const g = glyphCount === 1 ? 0 : Math.floor(v * (glyphCount - 1) + 0.5);
					if (glyphCount > 1 && g === 0) continue;
					const c = Math.min(colorCount - 1, Math.floor(v * colorCount));
					ctx.drawImage(
						atlas,
						g * cw,
						c * ch,
						cw,
						ch,
						Math.round(col * spec.cellW * dpr),
						Math.round(row * spec.cellH * dpr),
						cw,
						ch
					);
				}
			}
		};

		const loop = (now: number) => {
			raf = requestAnimationFrame(loop);
			if (now - last < 1000 / spec.fps) return;
			last = now;
			draw(now);
		};

		const play = () => {
			if (reduceMotion || raf || !visible) return;
			raf = requestAnimationFrame(loop);
		};
		const pause = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};

		const onPointerMove = (e: PointerEvent) => {
			const rect = host.getBoundingClientRect();
			pointer.x = (e.clientX - rect.left) / spec.cellW;
			pointer.y = (e.clientY - rect.top) / spec.cellH;
			if (reduceMotion) draw(performance.now());
		};
		const onPointerLeave = () => {
			pointer.x = -10000;
			pointer.y = -10000;
		};

		resize();
		draw(start);
		document.fonts?.ready.then(() => {
			buildAtlas();
			draw(performance.now());
		});

		const resizeObserver = new ResizeObserver(() => {
			resize();
			draw(performance.now());
		});
		resizeObserver.observe(host);

		const intersectionObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible) play();
			else pause();
		});
		intersectionObserver.observe(host);

		host.addEventListener("pointermove", onPointerMove);
		host.addEventListener("pointerleave", onPointerLeave);

		return () => {
			pause();
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			host.removeEventListener("pointermove", onPointerMove);
			host.removeEventListener("pointerleave", onPointerLeave);
		};
	}, [variant]);

	return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
