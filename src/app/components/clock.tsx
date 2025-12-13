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
	const [time, setTime] = useState<string>(() => getFormattedTime());
	useEffect(() => {

		const interval = setInterval(() => {
			setTime(getFormattedTime());
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex items-center gap-2">
			<span className="text-white font-khand text-2xl">{time}</span>
		</div>
	);
}
