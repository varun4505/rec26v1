"use client";

import { useState, useEffect } from "react";

function getFormattedTime(): string {
	const now = new Date();
	let hours = now.getHours();
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12; // 0 should be 12
	const displayHours = String(hours).padStart(2, "0");
	return `${displayHours}:${minutes} ${ampm}`;
}

export default function Clock() {
	const [time, setTime] = useState<string>("");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		setTime(getFormattedTime());
		const interval = setInterval(() => {
			setTime(getFormattedTime());
		}, 1000); // Check every second for closer sync

		return () => clearInterval(interval);
	}, []);

	if (!mounted) {
		return <div className="flex items-center gap-2"><div className="w-20 h-8"></div></div>; // Placeholder
	}

	return (
		<div className="flex items-center gap-2">
			<span className="text-white font-khand text-2xl">{time}</span>
		</div>
	);
}
