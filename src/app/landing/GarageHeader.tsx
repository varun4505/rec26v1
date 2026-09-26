"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import s from "./Landing.module.css";
import CommandPalette from "./CommandPalette";
import { RECRUITMENT_HREF } from "./data";
import { openPalette, openTerminal } from "./events";

export default function GarageHeader() {
	const { data: session } = useSession();
	const [modKey, setModKey] = useState("Ctrl");

	useEffect(() => {
		if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) setModKey("⌘");
	}, []);

	return (
		<>
			<header className={s.hdr}>
				<a
					href="#top"
					className={s.hdrHome}
					aria-label="VinnovateIT home"
					onClick={(e) => {
						e.preventDefault();
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}
				>
					<Image src="/whiteLogoViit.svg" alt="VinnovateIT" width={92} height={30} priority />
				</a>
				<div className={s.hdrRight}>
					<button type="button" className={s.hdrCmd} onClick={openPalette}>
						<span className={s.hdrCmdLabel}>Jump to</span>
						<span className={s.hdrCmdKeys} aria-hidden="true">
							<kbd>{modKey}</kbd>
							<kbd>K</kbd>
						</span>
					</button>
					<Link href={RECRUITMENT_HREF} prefetch={false} className={`${s.hdrCmd} ${s.hdrSignIn}`}>
						{session ? "Profile" : "Sign in"}
					</Link>
					<button
						type="button"
						className={s.hdrTerminal}
						onClick={openTerminal}
						aria-label="Open terminal"
						title="Open terminal"
					>
						<span>&gt;</span>
						<span className={s.hdrTerminalCursor}>_</span>
					</button>
				</div>
			</header>
			<CommandPalette />
		</>
	);
}
