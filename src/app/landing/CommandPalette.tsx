"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import s from "./Landing.module.css";
import { RECRUITMENT_HREF, sections, socialLinks } from "./data";
import { OPEN_PALETTE_EVENT, openTerminal, scrollToSection } from "./events";

type Item = {
	id: string;
	group: "Jump to" | "Actions" | "Links";
	label: string;
	hint: string;
	run: () => void;
};

export default function CommandPalette() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [active, setActive] = useState(0);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const restoreFocusRef = useRef<HTMLElement | null>(null);

	const items = useMemo<Item[]>(
		() => [
			...sections.map((section) => ({
				id: `section-${section.id}`,
				group: "Jump to" as const,
				label: section.label,
				hint: `#${section.id}`,
				run: () => scrollToSection(section.id),
			})),
			{
				id: "terminal",
				group: "Actions",
				label: "Open the VIIT terminal",
				hint: ">_",
				run: openTerminal,
			},
			{
				id: "recruitments",
				group: "Actions",
				label: "Recruitments 2025",
				hint: RECRUITMENT_HREF,
				run: () => router.push(RECRUITMENT_HREF),
			},
			...socialLinks.map((link) => ({
				id: `link-${link.label}`,
				group: "Links" as const,
				label: link.label,
				hint: "↗",
				run: () => {
					if (link.href.startsWith("mailto:")) window.location.href = link.href;
					else window.open(link.href, "_blank", "noopener,noreferrer");
				},
			})),
		],
		[router]
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter(
			(item) =>
				item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q)
		);
	}, [items, query]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		const onOpen = () => setOpen(true);
		window.addEventListener("keydown", onKey);
		window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
		};
	}, []);

	useEffect(() => {
		if (open) {
			restoreFocusRef.current = document.activeElement as HTMLElement | null;
			setQuery("");
			setActive(0);
			requestAnimationFrame(() => inputRef.current?.focus());
		} else {
			restoreFocusRef.current?.focus?.();
		}
	}, [open]);

	useEffect(() => setActive(0), [query]);

	if (!open) return null;

	const choose = (item: Item | undefined) => {
		if (!item) return;
		restoreFocusRef.current = null;
		setOpen(false);
		// Let the dialog unmount before scrolling or focusing elsewhere.
		requestAnimationFrame(item.run);
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			e.preventDefault();
			setOpen(false);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			choose(filtered[active]);
		}
	};

	let lastGroup = "";

	return (
		<div className={s.paletteBackdrop} onMouseDown={() => setOpen(false)}>
			<div
				className={s.palette}
				role="dialog"
				aria-modal="true"
				aria-label="Jump to"
				onMouseDown={(e) => e.stopPropagation()}
				onKeyDown={onKeyDown}
			>
				<div className={s.paletteSearch}>
					<span className={s.palettePrompt} aria-hidden="true">
						&gt;
					</span>
					<input
						ref={inputRef}
						className={s.paletteInput}
						placeholder="Jump to a section, action or link…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						role="combobox"
						aria-expanded="true"
						aria-controls="palette-list"
						aria-activedescendant={filtered[active] ? `palette-${filtered[active].id}` : undefined}
						spellCheck={false}
						autoComplete="off"
					/>
					<kbd className={s.paletteEsc}>esc</kbd>
				</div>
				<ul className={s.paletteList} id="palette-list" role="listbox">
					{filtered.length === 0 && <li className={s.paletteEmpty}>No matches. Try “terminal”.</li>}
					{filtered.map((item, i) => {
						const showGroup = item.group !== lastGroup;
						lastGroup = item.group;
						return (
							<React.Fragment key={item.id}>
								{showGroup && (
									<li className={s.paletteGroup} role="presentation">
										{item.group}
									</li>
								)}
								<li
									id={`palette-${item.id}`}
									role="option"
									aria-selected={i === active}
									className={`${s.paletteItem} ${i === active ? s.paletteItemActive : ""}`}
									onMouseMove={() => setActive(i)}
									onClick={() => choose(item)}
								>
									<span>{item.label}</span>
									<span className={s.paletteHint}>{item.hint}</span>
								</li>
							</React.Fragment>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
