"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import s from "./Landing.module.css";
import AsciiCanvas from "./AsciiCanvas";
import Capybara from "./Capybara";
import { RECRUITMENT_HREF, domains, projects, socialLinks } from "./data";
import { OPEN_TERMINAL_EVENT } from "./events";

type Line = { id: number; kind: "in" | "out" | "err" | "dim"; text: string; href?: string };

let lineId = 0;
const line = (kind: Line["kind"], text: string, href?: string): Line => ({
	id: ++lineId,
	kind,
	text,
	href,
});

const WELCOME: Line[] = [line("dim", "Type “help”, or “apply” to get started.")];

const HELP = [
	"available commands:",
	"  about      who we are",
	"  domains    what you can join",
	"  projects   things we shipped",
	"  apply      recruitments ’25",
	"  socials    where to find us",
	"  whoami · date · clear",
];

function runCommand(raw: string, go: (href: string) => void): Line[] | "clear" {
	const input = raw.trim();
	const [cmd = "", ...args] = input.split(/\s+/);
	switch (cmd.toLowerCase()) {
		case "":
			return [];
		case "help":
		case "?":
			return HELP.map((t) => line("out", t));
		case "about":
			return [
				line("out", "VinnovateIT: a student-run tech space for people"),
				line("out", "who’d rather build than brainstorm forever."),
				line("out", "ship first, overthink later."),
			];
		case "domains":
		case "ls":
			return domains.map((d) =>
				line("out", `${d.name.toLowerCase().padEnd(11)}${d.tags.join(" · ").toLowerCase()}`)
			);
		case "projects":
			return projects.map((p) =>
				line("out", `${p.name.toLowerCase().padEnd(12)}${p.tags.slice(0, 2).join(" · ").toLowerCase()} ↗`, p.href)
			);
		case "apply":
		case "join":
		case "recruit":
			window.setTimeout(() => go(RECRUITMENT_HREF), 700);
			return [line("out", "opening recruitments ’25 …")];
		case "socials":
		case "contact":
			return socialLinks.map((l) => line("out", `${l.label.toLowerCase()} ↗`, l.href));
		case "whoami":
			return [line("out", "guest@viit, a future builder (probably).")];
		case "date":
			return [line("out", new Date().toString().split(" GMT")[0])];
		case "echo":
			return [line("out", args.join(" "))];
		case "hi":
		case "hello":
		case "hey":
			return [line("out", "hey! type “apply” whenever you’re ready.")];
		case "capy":
		case "capybara":
			return [line("out", "the capybara on top is unionised. pet responsibly.")];
		case "sudo":
			return [line("err", "nice try. you need to join the club first.")];
		case "exit":
			return [line("out", "there is no exit. only build mode.")];
		case "clear":
		case "cls":
			return "clear";
		default:
			return [line("err", `command not found: ${cmd}. try “help”.`)];
	}
}

let topZ = 20;

function Draggable({
	className,
	style,
	children,
	label,
}: {
	className: string;
	style: React.CSSProperties;
	children: React.ReactNode;
	label?: string;
}) {
	const ref = useRef<HTMLDivElement | null>(null);
	const offset = useRef({ x: 0, y: 0 });
	const drag = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number } | null>(null);

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		const el = ref.current;
		if (!el) return;
		e.preventDefault();
		el.setPointerCapture(e.pointerId);
		drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: offset.current.x, oy: offset.current.y };
		el.style.zIndex = String(++topZ);
		el.dataset.dragging = "true";
	};

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const d = drag.current;
		const el = ref.current;
		if (!d || !el || d.id !== e.pointerId) return;
		offset.current = { x: d.ox + e.clientX - d.sx, y: d.oy + e.clientY - d.sy };
		el.style.translate = `${offset.current.x}px ${offset.current.y}px`;
	};

	const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		const el = ref.current;
		if (!el || drag.current?.id !== e.pointerId) return;
		drag.current = null;
		delete el.dataset.dragging;
	};

	return (
		<div
			ref={ref}
			className={className}
			style={style}
			title={label ?? "drag me"}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerUp}
		>
			{children}
		</div>
	);
}

const at = (left: number, top: number, rotate: number): React.CSSProperties =>
	({ left, top, "--r": `${rotate}deg` }) as React.CSSProperties;

function StarSticker() {
	return (
		<svg viewBox="0 0 40 40" width="40" height="40">
			<path
				d="M20 3l4.9 10.6 11.6 1.3-8.6 7.9 2.4 11.4L20 28.4 9.7 34.2l2.4-11.4-8.6-7.9 11.6-1.3z"
				fill="#ffc933"
				stroke="#fff"
				strokeWidth="3"
				strokeLinejoin="round"
				paintOrder="stroke"
			/>
		</svg>
	);
}

function SmileySticker() {
	return (
		<svg viewBox="0 0 40 40" width="40" height="40">
			<circle cx="20" cy="20" r="17" fill="#ffd93b" stroke="#fff" strokeWidth="3" />
			<ellipse cx="14.5" cy="16" rx="2" ry="3" fill="#3b2a00" />
			<ellipse cx="25.5" cy="16" rx="2" ry="3" fill="#3b2a00" />
			<path d="M12 23c2.4 4 13.6 4 16 0" fill="none" stroke="#3b2a00" strokeWidth="2.4" strokeLinecap="round" />
		</svg>
	);
}

function FlowerSticker() {
	return (
		<svg viewBox="0 0 40 40" width="36" height="36">
			<g fill="#ff7eb6" stroke="#fff" strokeWidth="2.5" paintOrder="stroke">
				{[0, 60, 120, 180, 240, 300].map((deg) => (
					<circle key={deg} cx="20" cy="9" r="7" transform={`rotate(${deg} 20 20)`} />
				))}
			</g>
			<circle cx="20" cy="20" r="6" fill="#ffd93b" />
		</svg>
	);
}

function MenuClock() {
	const [time, setTime] = useState("");
	useEffect(() => {
		const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
		const tick = () => setTime(fmt.format(new Date()));
		tick();
		const id = window.setInterval(tick, 15000);
		return () => window.clearInterval(id);
	}, []);
	return <span className={s.menuClock}>{time}</span>;
}

export default function LabStage() {
	const router = useRouter();
	const [lines, setLines] = useState<Line[]>(WELCOME);
	const [value, setValue] = useState("");
	const [flash, setFlash] = useState(false);
	const history = useRef<string[]>([]);
	const historyIndex = useRef(-1);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const logRef = useRef<HTMLDivElement | null>(null);
	const sectionRef = useRef<HTMLElement | null>(null);

	const execute = useCallback(
		(raw: string) => {
			const result = runCommand(raw, (href) => router.push(href));
			if (raw.trim()) {
				history.current.unshift(raw);
				historyIndex.current = -1;
			}
			if (result === "clear") {
				setLines([]);
				return;
			}
			setLines((prev) => [...prev, line("in", raw), ...result].slice(-60));
		},
		[router]
	);

	useEffect(() => {
		const log = logRef.current;
		if (log) log.scrollTop = log.scrollHeight;
	}, [lines]);

	useEffect(() => {
		const onOpen = () => {
			sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
			window.setTimeout(() => {
				inputRef.current?.focus({ preventScroll: true });
				setFlash(true);
				window.setTimeout(() => setFlash(false), 650);
			}, 450);
		};
		window.addEventListener(OPEN_TERMINAL_EVENT, onOpen);
		return () => window.removeEventListener(OPEN_TERMINAL_EVENT, onOpen);
	}, []);

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const h = history.current;
		if (e.key === "ArrowUp" && h.length) {
			e.preventDefault();
			historyIndex.current = Math.min(historyIndex.current + 1, h.length - 1);
			setValue(h[historyIndex.current]);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			historyIndex.current = Math.max(historyIndex.current - 1, -1);
			setValue(historyIndex.current === -1 ? "" : h[historyIndex.current]);
		}
	};

	const screen = (
		<div
			className={`${s.screen} ${flash ? s.screenFlash : ""}`}
			onClick={(e) => {
				if ((e.target as HTMLElement).closest("a, button")) return;
				inputRef.current?.focus({ preventScroll: true });
			}}
		>
			<div className={s.menubar} aria-hidden="true">
				<span className={s.menuLogo} />
				<span>File</span>
				<span>Edit</span>
				<span className={s.menuOptional}>View</span>
				<span className={s.menuOptional}>Special</span>
				<span>Help</span>
				<MenuClock />
			</div>
			<div className={s.window}>
				<div className={s.titlebar}>
					<span className={s.titleBox} />
					<span className={s.titleText}>● VIIT CLI v25</span>
					<span className={s.titleBox} />
				</div>
				<div className={s.windowBody}>
					<h2 id="lab-title" className={s.cliTitle}>
						VIIT CLI
					</h2>
					<p className={s.cliSub}>built in build mode by vinnovateit</p>
					<div className={s.cliButtons}>
						<button type="button" className={s.cliBtn} onClick={() => execute("help")}>
							Help
						</button>
						<button type="button" className={s.cliBtn} onClick={() => execute("domains")}>
							Domains
						</button>
						<button
							type="button"
							className={`${s.cliBtn} ${s.cliBtnPrimary}`}
							onClick={() => execute("apply")}
						>
							Apply
						</button>
					</div>
					<div className={s.cliLog} ref={logRef} aria-live="polite">
						{lines.map((l) => (
							<div key={l.id} className={`${s.cliLine} ${s[`cliLine_${l.kind}`] ?? ""}`}>
								{l.kind === "in" && <span className={s.cliPromptInline}>viit@lab ~ % </span>}
								{l.href ? (
									<a
										href={l.href}
										target={l.href.startsWith("mailto:") ? undefined : "_blank"}
										rel="noopener noreferrer"
									>
										{l.text}
									</a>
								) : (
									l.text
								)}
							</div>
						))}
					</div>
					<form
						className={s.cliPrompt}
						onSubmit={(e) => {
							e.preventDefault();
							execute(value);
							setValue("");
						}}
					>
						<label htmlFor="viit-cli" className={s.cliPromptLabel}>
							viit@lab ~ %
						</label>
						<input
							id="viit-cli"
							ref={inputRef}
							className={s.cliInput}
							value={value}
							onChange={(e) => setValue(e.target.value)}
							onKeyDown={onKeyDown}
							placeholder="ask me anything… or try “help”"
							autoComplete="off"
							autoCapitalize="off"
							spellCheck={false}
						/>
					</form>
				</div>
			</div>
			<div className={s.screenGlass} aria-hidden="true" />
		</div>
	);

	return (
		<section className={s.stage} id="lab" ref={sectionRef} aria-labelledby="lab-title">
			<AsciiCanvas variant="field" className={s.stageCanvas} />
			<div className={s.stageDesk} aria-hidden="true" />

			<div className={s.cabScene}>
				<div className={s.cabShadow} aria-hidden="true" />
				<div className={s.cab}>
					{/* Left side of the case, folded back into the page. */}
					<div className={s.cabSide} aria-hidden="true">
						<span className={s.sideGrip} />
						<span className={s.sideVents} />
						<span className={s.sideKnob} />
						<span className={s.sidePanel}>
							<i className={s.sidePortPower} />
							<i className={s.sidePortSerial} />
						</span>
						<span className={`${s.sideScrew} ${s.sideScrewA}`} />
						<span className={`${s.sideScrew} ${s.sideScrewB}`} />
						<span className={s.sidePlate}>
							VINNOVATEIT VT-25
							<em>built on campus · unit 00</em>
						</span>
					</div>

					<div className={s.cabFace}>
						<div className={s.bezel}>{screen}</div>
						<div className={s.deck} aria-hidden="true">
							<span className={s.deckBadge}>VinnovateIT</span>
							<span className={s.deckKnob} />
							<span className={s.deckSlot} />
							<span className={s.deckLed} />
						</div>
					</div>

					{/* Notes and stickers stuck to the front of the case. */}
					<div className={s.cabDecor} aria-hidden="true">
						<Draggable className={`${s.sticker} ${s.stickerShip}`} style={at(70, 8, -8)}>
							SHIP IT!
						</Draggable>
						<Draggable className={`${s.sticker} ${s.stickerBadge}`} style={at(456, 16, 10)}>
							VIIT
							<br />
							’25
						</Draggable>
						<Draggable className={`${s.sticker} ${s.stickerIcon}`} style={at(530, 26, 14)}>
							<StarSticker />
						</Draggable>
						<Draggable className={`${s.sticker} ${s.stickerIcon}`} style={at(-8, 150, -6)}>
							<SmileySticker />
						</Draggable>
						<Draggable className={`${s.sticker} ${s.stickerIcon}`} style={at(538, 226, 0)}>
							<FlowerSticker />
						</Draggable>

						<Draggable className={`${s.note} ${s.notePurple} ${s.noteSmall}`} style={at(34, 452, 2)}>
							hi :)
						</Draggable>
						<Draggable className={`${s.note} ${s.noteYellow} ${s.noteSmall}`} style={at(116, 444, -4)}>
							bonjour, builder
						</Draggable>
						<Draggable className={`${s.note} ${s.noteOrange} ${s.noteSmall}`} style={at(198, 450, 3)}>
							coffee → code
						</Draggable>
						<Draggable className={`${s.note} ${s.notePink} ${s.noteSmall}`} style={at(356, 448, -3)}>
							nice pixels &lt;3
						</Draggable>
						<Draggable className={`${s.note} ${s.noteYellow} ${s.noteSmall}`} style={at(438, 440, 4)}>
							sup
						</Draggable>
						<Draggable className={`${s.note} ${s.noteYellow}`} style={at(500, 330, -3)}>
							TODO:
							<br />· build
							<br />· break
							<br />· repeat
						</Draggable>
					</div>

					{/* A column of notes wrapped around the left edge of the case. */}
					<div className={s.cabSideNotes} aria-hidden="true">
						<Draggable className={`${s.sticker} ${s.stickerBadge} ${s.stickerBadgeAlt}`} style={at(40, 44, -6)}>
							VT
							<br />
							25
						</Draggable>
						<Draggable className={`${s.note} ${s.notePink}`} style={at(16, 150, -2)}>
							welcome to the lab!
						</Draggable>
						<Draggable className={`${s.note} ${s.noteYellow}`} style={at(12, 244, 1)}>
							RECRUITMENTS ’25
							<br />· go apply ·
						</Draggable>
						<Draggable className={`${s.note} ${s.notePurple}`} style={at(18, 336, -1)}>
							do not unplug
						</Draggable>
						<Draggable className={`${s.note} ${s.noteOrange}`} style={at(14, 422, 2)}>
							ship first, overthink later
						</Draggable>
					</div>

					<Capybara />
				</div>
			</div>
		</section>
	);
}
