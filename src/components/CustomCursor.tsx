"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
	const cursorX = useMotionValue(-100);
	const cursorY = useMotionValue(-100);

	const springConfig = { damping: 25, stiffness: 700 };
	const cursorXSpring = useSpring(cursorX, springConfig);
	const cursorYSpring = useSpring(cursorY, springConfig);

	const [isHovering, setIsHovering] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isTouchDevice, setIsTouchDevice] = useState(false);
	const [isClicking, setIsClicking] = useState(false);

	useEffect(() => {
		// Check for touch device
		if (typeof window !== "undefined") {
			setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
		}

		const moveCursor = (e: MouseEvent) => {
			cursorX.set(e.clientX - 16); // Center offset (32px / 2)
			cursorY.set(e.clientY - 16);
			if (!isVisible) setIsVisible(true);
		};

		const handleMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const isLink = target.tagName === "A" || target.closest("a");
			const isButton = target.tagName === "BUTTON" || target.closest("button");
			const isClickable =
				target.classList.contains("cursor-pointer") ||
				target.closest(".cursor-pointer");
			const isText = [
				"P",
				"SPAN",
				"H1",
				"H2",
				"H3",
				"H4",
				"H5",
				"H6",
				"LI",
			].includes(target.tagName);

			if (isLink || isButton || isClickable || isText) {
				setIsHovering(true);
			} else {
				setIsHovering(false);
			}
		};

		const handleMouseLeave = () => setIsVisible(false);
		const handleMouseEnter = () => setIsVisible(true);
		const handleMouseDown = () => setIsClicking(true);
		const handleMouseUp = () => setIsClicking(false);

		window.addEventListener("mousemove", moveCursor);
		window.addEventListener("mouseover", handleMouseOver);
		document.body.addEventListener("mouseleave", handleMouseLeave);
		document.body.addEventListener("mouseenter", handleMouseEnter);
		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousemove", moveCursor);
			window.removeEventListener("mouseover", handleMouseOver);
			document.body.removeEventListener("mouseleave", handleMouseLeave);
			document.body.removeEventListener("mouseenter", handleMouseEnter);
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [cursorX, cursorY, isVisible]);

	if (isTouchDevice) return null;

	return (
		<motion.div
			className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
			style={{
				x: cursorXSpring,
				y: cursorYSpring,
				width: 32,
				height: 32,
			}}
			animate={{
				backgroundColor: isHovering ? "transparent" : "#F86800",
				border: "3px solid #000000",
				scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
				opacity: isVisible ? 1 : 0,
			}}
			transition={{
				type: "spring",
				stiffness: 500,
				damping: 28,
				opacity: { duration: 0.2 },
			}}
		/>
	);
}
