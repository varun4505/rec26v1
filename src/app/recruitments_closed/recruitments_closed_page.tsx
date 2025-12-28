"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import styles from "./recruitments_closed.module.css";

// ============== TYPES ==============
interface LetterState {
	id: number;
	char: string;
	x: number;
	y: number;
	color: string;
	scale: number;
	rotation: number;
	vx: number;
	vy: number;
	collected: boolean;
	letterSize: number;
}

interface GameObject {
	id: number;
	x: number;
	y: number;
	type:
		| "bug"
		| "crash"
		| "null"
		| "404"
		| "virus"
		| "coffee"
		| "build"
		| "star"
		| "merge"
		| "testpass";
	speed: number;
	size: number;
}

interface LeaderboardEntry {
	name: string;
	score: number;
	date: string;
}

// ============== FLOATING LETTERS (GRAVITY ON INTERACT) ==============
const FloatingLetters: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [letters, setLetters] = useState<LetterState[]>([]);
	const [draggingId, setDraggingId] = useState<number | null>(null);
	const dragOffsetRef = useRef({ x: 0, y: 0 });
	const animationRef = useRef<number | null>(null);
	const lastMouseRef = useRef({ x: 0, y: 0 });

	const colors = React.useMemo(() => ["#f86800"], []);

	const GROUND_OFFSET = 40; // Ground line offset from bottom

	// Responsive letter size using viewport width (vw equivalent in pixels)
	const getLetterSize = (
		containerWidth: number,
		viewportWidth: number,
		maxCharsInLine: number
	) => {
		// Calculate max size that fits the longest line
		const maxWidthForText = containerWidth * 0.95; // 95% of container width
		const gapRatio = 0.12;
		// Size based on fitting longest line: totalWidth = chars * (size + size*gapRatio) - size*gapRatio
		// Solve for size: size = maxWidth / (chars * (1 + gapRatio) - gapRatio)
		const sizeToFitLine =
			maxWidthForText / (maxCharsInLine * (1 + gapRatio) - gapRatio);

		// Also consider viewport-based sizing
		const vwSize = viewportWidth * 0.05; // 5vw
		const containerBasedSize = containerWidth * 0.06; // 6% of container

		// Use the smallest of all constraints, with min 25px and max 80px
		return Math.max(
			25,
			Math.min(80, Math.min(vwSize, containerBasedSize, sizeToFitLine))
		);
	};

	// Initialize floating letters
	const initLetters = useCallback(() => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const viewportWidth = window.innerWidth;

		// ====== CHANGE YOUR TEXT HERE ======
		const textLines = ["THANK YOU", "FOR", "PARTICIPATING!"];
		// ===================================

		// Find the longest line (by character count, excluding spaces)
		const maxCharsInLine = Math.max(
			...textLines.map((line) => line.replace(/\s/g, "").length)
		);

		const LETTER_SIZE = getLetterSize(
			rect.width,
			viewportWidth,
			maxCharsInLine
		);
		const gap = LETTER_SIZE * 0.12;
		const newLetters: LetterState[] = [];
		let globalIdx = 0;

		// Calculate total height needed and center vertically
		const lineHeight = LETTER_SIZE * 1.2;
		const totalTextHeight = textLines.length * lineHeight;
		const availableHeight = rect.height - GROUND_OFFSET;
		// Center text vertically - account for the text block height
		const startY = Math.max(
			20,
			(availableHeight - totalTextHeight) / 2 + totalTextHeight * 0.15
		);

		const lines = textLines.map((text, idx) => ({
			text,
			y: startY + idx * lineHeight,
		}));

		lines.forEach((line) => {
			const lineChars = line.text.replace(/\s/g, "");
			const totalWidth = lineChars.length * (LETTER_SIZE + gap) - gap;
			// Ensure x never goes negative - center within container
			let x = Math.max(5, (rect.width - totalWidth) / 2);

			for (const char of line.text) {
				if (char === " ") {
					x += LETTER_SIZE * 0.5;
					continue;
				}
				newLetters.push({
					id: globalIdx,
					char,
					x: Math.max(0, Math.min(x, rect.width - LETTER_SIZE)), // Clamp x within bounds
					y: Math.min(line.y, availableHeight), // Ensure letters don't start below ground
					color: colors[globalIdx % colors.length],
					scale: 1,
					rotation: (Math.random() - 0.5) * 6,
					vx: 0,
					vy: 0,
					collected: false,
					letterSize: LETTER_SIZE, // Store size per letter
				});
				x += LETTER_SIZE + gap;
				globalIdx++;
			}
		});

		setLetters(newLetters);
	}, [colors]);

	useEffect(() => {
		initLetters();
		window.addEventListener("resize", initLetters);
		return () => window.removeEventListener("resize", initLetters);
	}, [initLetters]);

	// Handle mouse down on letter - activates gravity
	const handleMouseDown = useCallback((e: React.MouseEvent, id: number) => {
		e.preventDefault();
		const rect = (e.target as HTMLElement).getBoundingClientRect();
		dragOffsetRef.current = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
		lastMouseRef.current = { x: e.clientX, y: e.clientY };
		setDraggingId(id);

		// Activate gravity for this letter
		setLetters((prev) =>
			prev.map((l) =>
				l.id === id ? { ...l, collected: true, vx: 0, vy: 0 } : l
			)
		);
	}, []);

	// Handle mouse move for dragging
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (draggingId === null || !containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			const newX = e.clientX - rect.left - dragOffsetRef.current.x;
			const newY = e.clientY - rect.top - dragOffsetRef.current.y;

			// Calculate velocity from mouse movement
			const vx = (e.clientX - lastMouseRef.current.x) * 0.5;
			const vy = (e.clientY - lastMouseRef.current.y) * 0.5;
			lastMouseRef.current = { x: e.clientX, y: e.clientY };

			setLetters((prev) =>
				prev.map((l) => {
					if (l.id !== draggingId) return l;
					const size = l.letterSize;
					const groundY = rect.height - GROUND_OFFSET - size;
					return {
						...l,
						x: Math.max(0, Math.min(rect.width - size, newX)),
						y: Math.max(0, Math.min(groundY, newY)),
						vx,
						vy,
					};
				})
			);
		},
		[draggingId]
	);

	// Handle mouse up - release letter with velocity
	const handleMouseUp = useCallback(() => {
		setDraggingId(null);
	}, []);

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	// Physics loop - floating animation + gravity for activated letters
	useEffect(() => {
		let time = 0;

		const loop = () => {
			time += 0.02;

			setLetters((prev) => {
				const rect = containerRef.current?.getBoundingClientRect();
				if (!rect) return prev;

				return prev.map((l, idx) => {
					// If being dragged, don't apply physics
					if (l.id === draggingId) return l;

					const size = l.letterSize;
					const groundY = rect.height - GROUND_OFFSET - size;
					let { x, y, vx, vy, rotation } = l;
					const hasGravity = l.collected;

					if (hasGravity) {
						// Apply gravity physics
						vy += 0.5;
						x += vx;
						y += vy;
						vx *= 0.98;
						vy *= 0.98;
						rotation += vx * 1.5;

						// Bounce off walls
						if (x < 0) {
							x = 0;
							vx = -vx * 0.6;
						}
						if (x > rect.width - size) {
							x = rect.width - size;
							vx = -vx * 0.6;
						}
						if (y < 0) {
							y = 0;
							vy = -vy * 0.6;
						}

						// Ground collision
						if (y > groundY) {
							y = groundY;
							vy = -vy * 0.4;
							vx *= 0.85;
							if (Math.abs(vy) < 1) vy = 0;
						}
					} else {
						// Floating animation - gentle bobbing
						const floatOffset = Math.sin(time * 2 + idx * 0.5) * 3;
						const floatRotation = Math.sin(time * 1.5 + idx * 0.7) * 2;
						y = l.y + floatOffset - (prev[idx]?.y !== l.y ? 0 : floatOffset);

						// Keep original position for floating letters
						return { ...l, rotation: floatRotation };
					}

					return { ...l, x, y, vx, vy, rotation };
				});
			});

			animationRef.current = requestAnimationFrame(loop);
		};

		animationRef.current = requestAnimationFrame(loop);
		return () => {
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
		};
	}, [draggingId]);

	return (
		<div className={styles.floatingSection}>
			<div className={styles.floatingContainer} ref={containerRef}>
				{/* Letters */}
				{letters.map((l) => (
					<div
						key={l.id}
						className={`${styles.floatingLetter} ${
							l.collected ? styles.hasGravity : ""
						}`}
						style={{
							left: l.x,
							top: l.y,
							width: l.letterSize,
							height: l.letterSize,
							fontSize: l.letterSize * 0.85,
							color: l.color,
							transform: `rotate(${l.rotation}deg) scale(${
								draggingId === l.id ? 1.1 : 1
							})`,
							textShadow: `0 0 30px ${l.color}80, 0 0 60px ${l.color}40`,
							cursor: draggingId === l.id ? "grabbing" : "grab",
							zIndex: draggingId === l.id ? 100 : 1,
						}}
						onMouseDown={(e) => handleMouseDown(e, l.id)}
					>
						{l.char}
					</div>
				))}

				{/* Ground line */}
				<div className={styles.groundLine} />
			</div>
		</div>
	);
};

// ============== BUG DODGE GAME ==============
const BugDodgeGame: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">(
		"idle"
	);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);
	const [lives, setLives] = useState(3);
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [playerName, setPlayerName] = useState("");
	const [showNameInput, setShowNameInput] = useState(false);
	const [level, setLevel] = useState(1);
	const [gameTime, setGameTime] = useState(0);

	const playerRef = useRef({ x: 0, y: 0, width: 50, height: 50 });
	const gameTimeRef = useRef(0);
	const objectsRef = useRef<GameObject[]>([]);
	const keysRef = useRef<Set<string>>(new Set());
	const gameLoopRef = useRef<number | null>(null);
	const spawnTimerRef = useRef<number | null>(null);
	const objectIdRef = useRef(0);

	// Load leaderboard and high score
	useEffect(() => {
		const saved = localStorage.getItem("bugDodgeLeaderboard");
		if (saved) setLeaderboard(JSON.parse(saved));
		const savedHigh = localStorage.getItem("bugDodgeHighScore");
		if (savedHigh) setHighScore(parseInt(savedHigh));
	}, []);

	const startGame = useCallback(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;

		playerRef.current = {
			x: canvas.width / 2 - 30,
			y: canvas.height - 100,
			width: 60,
			height: 60,
		};
		objectsRef.current = [];
		objectIdRef.current = 0;
		gameTimeRef.current = 0;

		setGameState("playing");
		setScore(0);
		setLives(3);
		setLevel(1);
		setGameTime(0);
		setShowNameInput(false);
	}, []);

	// Handle keyboard input
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				[
					"ArrowUp",
					"ArrowDown",
					"ArrowLeft",
					"ArrowRight",
					"w",
					"a",
					"s",
					"d",
					" ",
				].includes(e.key)
			) {
				e.preventDefault();
				keysRef.current.add(e.key.toLowerCase());
			}
			if (e.key === "Enter" && gameState === "idle") {
				startGame();
			}
			if (e.key === "Enter" && gameState === "gameover" && !showNameInput) {
				startGame();
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			keysRef.current.delete(e.key.toLowerCase());
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [gameState, showNameInput, startGame]);

	// Game time tracker for difficulty
	useEffect(() => {
		if (gameState !== "playing") return;

		const timer = setInterval(() => {
			gameTimeRef.current += 1;
			setGameTime(gameTimeRef.current);

			// Level up every 10 seconds
			const newLevel = Math.min(Math.floor(gameTimeRef.current / 10) + 1, 20);
			if (newLevel !== level) {
				setLevel(newLevel);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [gameState, level]);

	// Spawn objects
	useEffect(() => {
		if (gameState !== "playing") return;

		const badItems = [
			{ type: "bug" as const, points: -1 },
			{ type: "crash" as const, points: -1 },
			{ type: "null" as const, points: -1 },
			{ type: "404" as const, points: -1 },
			{ type: "virus" as const, points: -1 },
		];

		const goodItems = [
			{ type: "coffee" as const, points: 5 },
			{ type: "build" as const, points: 10 },
			{ type: "star" as const, points: 15 },
			{ type: "merge" as const, points: 20 },
			{ type: "testpass" as const, points: 25 },
		];

		const spawnObject = () => {
			if (!canvasRef.current) return;
			const canvas = canvasRef.current;

			// Start with more good items, gradually shift to more bad items
			const badChance = Math.min(0.5 + level * 0.025, 0.8); // 50% -> 80% over time
			const isBad = Math.random() < badChance;
			const itemPool = isBad ? badItems : goodItems;
			const item = itemPool[Math.floor(Math.random() * itemPool.length)];

			// Speed starts SLOW and gradually increases
			// Level 1: 1-2 speed, Level 20: 4-6 speed
			const baseSpeed = 0.8 + level * 0.15;
			const speedVariation = Math.random() * 1;

			const newObject: GameObject = {
				id: objectIdRef.current++,
				x: Math.random() * (canvas.width - 60) + 30,
				y: -60,
				type: item.type,
				speed: baseSpeed + speedVariation,
				size: 45,
			};

			objectsRef.current.push(newObject);
		};

		// Spawn rate: starts at 2000ms (slow), decreases to 600ms
		const spawnRate = Math.max(2000 - level * 80, 600);
		spawnTimerRef.current = window.setInterval(spawnObject, spawnRate);

		return () => {
			if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
		};
	}, [gameState, level]);

	// Game loop
	useEffect(() => {
		if (gameState !== "playing" || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const playerSpeed = 5;

		const gameLoop = () => {
			// Clear canvas
			ctx.fillStyle = "#0a0a0f";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw stars background (static positions)
			ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
			for (let i = 0; i < 80; i++) {
				const x = (i * 137 + i * i * 3) % canvas.width;
				const y = (i * 97 + i * 7) % canvas.height;
				const size = i % 3 === 0 ? 2 : 1;
				ctx.beginPath();
				ctx.arc(x, y, size, 0, Math.PI * 2);
				ctx.fill();
			}

			// Draw grid
			ctx.strokeStyle = "rgba(248, 104, 0, 0.08)";
			ctx.lineWidth = 1;
			for (let x = 0; x < canvas.width; x += 50) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, canvas.height);
				ctx.stroke();
			}
			for (let y = 0; y < canvas.height; y += 50) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(canvas.width, y);
				ctx.stroke();
			}

			// Update player position
			const player = playerRef.current;
			const keys = keysRef.current;

			if (keys.has("arrowleft") || keys.has("a")) player.x -= playerSpeed;
			if (keys.has("arrowright") || keys.has("d")) player.x += playerSpeed;
			if (keys.has("arrowup") || keys.has("w")) player.y -= playerSpeed;
			if (keys.has("arrowdown") || keys.has("s")) player.y += playerSpeed;

			// Boundary check
			player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
			player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

			// Draw player (developer) - custom icon
			const playerCenterX = player.x + player.width / 2;
			const playerCenterY = player.y + player.height / 2;

			// Body
			ctx.fillStyle = "#f86800";
			ctx.beginPath();
			ctx.arc(playerCenterX, playerCenterY - 5, 18, 0, Math.PI * 2);
			ctx.fill();

			// Head
			ctx.fillStyle = "#fbbf24";
			ctx.beginPath();
			ctx.arc(playerCenterX, playerCenterY - 20, 12, 0, Math.PI * 2);
			ctx.fill();

			// Eyes (glasses)
			ctx.fillStyle = "#1e3a5f";
			ctx.fillRect(playerCenterX - 10, playerCenterY - 24, 8, 6);
			ctx.fillRect(playerCenterX + 2, playerCenterY - 24, 8, 6);
			ctx.strokeStyle = "#1e3a5f";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(playerCenterX - 2, playerCenterY - 21);
			ctx.lineTo(playerCenterX + 2, playerCenterY - 21);
			ctx.stroke();

			// Laptop
			ctx.fillStyle = "#374151";
			ctx.fillRect(playerCenterX - 15, playerCenterY + 5, 30, 18);
			ctx.fillStyle = "#60a5fa";
			ctx.fillRect(playerCenterX - 12, playerCenterY + 8, 24, 12);

			// Update and draw objects
			const objects = objectsRef.current;
			const toRemove: number[] = [];

			objects.forEach((obj, index) => {
				obj.y += obj.speed;

				// Draw object with custom icons (no emojis)
				const centerX = obj.x + obj.size / 2;
				const centerY = obj.y + obj.size / 2;
				const radius = obj.size / 2 - 5;

				ctx.save();

				switch (obj.type) {
					case "bug":
						// Actual bug with body, head and legs
						ctx.fillStyle = "#22c55e"; // Green bug body
						// Body (oval)
						ctx.beginPath();
						ctx.ellipse(centerX, centerY + 2, 12, 10, 0, 0, Math.PI * 2);
						ctx.fill();
						// Head
						ctx.beginPath();
						ctx.arc(centerX, centerY - 12, 7, 0, Math.PI * 2);
						ctx.fill();
						// Legs
						ctx.strokeStyle = "#166534";
						ctx.lineWidth = 2;
						ctx.lineCap = "round";
						// Left legs
						ctx.beginPath();
						ctx.moveTo(centerX - 10, centerY - 3);
						ctx.lineTo(centerX - 18, centerY - 10);
						ctx.moveTo(centerX - 11, centerY + 2);
						ctx.lineTo(centerX - 19, centerY + 2);
						ctx.moveTo(centerX - 10, centerY + 7);
						ctx.lineTo(centerX - 18, centerY + 14);
						// Right legs
						ctx.moveTo(centerX + 10, centerY - 3);
						ctx.lineTo(centerX + 18, centerY - 10);
						ctx.moveTo(centerX + 11, centerY + 2);
						ctx.lineTo(centerX + 19, centerY + 2);
						ctx.moveTo(centerX + 10, centerY + 7);
						ctx.lineTo(centerX + 18, centerY + 14);
						ctx.stroke();
						// Antennae
						ctx.beginPath();
						ctx.moveTo(centerX - 4, centerY - 17);
						ctx.lineTo(centerX - 8, centerY - 24);
						ctx.moveTo(centerX + 4, centerY - 17);
						ctx.lineTo(centerX + 8, centerY - 24);
						ctx.stroke();
						// Eyes
						ctx.fillStyle = "#000";
						ctx.beginPath();
						ctx.arc(centerX - 3, centerY - 13, 2, 0, Math.PI * 2);
						ctx.arc(centerX + 3, centerY - 13, 2, 0, Math.PI * 2);
						ctx.fill();
						break;
					case "crash":
						// Red explosion star
						ctx.fillStyle = "#ef4444";
						ctx.beginPath();
						for (let i = 0; i < 8; i++) {
							const angle = (i * Math.PI) / 4 - Math.PI / 8;
							const r = i % 2 === 0 ? radius : radius * 0.5;
							const px = centerX + Math.cos(angle) * r;
							const py = centerY + Math.sin(angle) * r;
							if (i === 0) ctx.moveTo(px, py);
							else ctx.lineTo(px, py);
						}
						ctx.closePath();
						ctx.fill();
						// Inner highlight
						ctx.fillStyle = "#fca5a5";
						ctx.beginPath();
						ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
						ctx.fill();
						break;
					case "null":
						// Purple circle with slash
						ctx.strokeStyle = "#a855f7";
						ctx.lineWidth = 4;
						ctx.beginPath();
						ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
						ctx.stroke();
						ctx.beginPath();
						ctx.moveTo(centerX - radius + 5, centerY + radius - 5);
						ctx.lineTo(centerX + radius - 5, centerY - radius + 5);
						ctx.stroke();
						break;
					case "404":
						// Red circle with "404" text
						ctx.fillStyle = "#dc2626";
						ctx.beginPath();
						ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
						ctx.fill();
						ctx.fillStyle = "#fff";
						ctx.font = "bold 14px Arial";
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						ctx.fillText("404", centerX, centerY);
						break;
					case "virus":
						// Skull icon
						ctx.fillStyle = "#6b7280";
						// Skull shape
						ctx.beginPath();
						ctx.arc(centerX, centerY - 3, radius - 3, 0, Math.PI * 2);
						ctx.fill();
						// Jaw
						ctx.fillRect(centerX - 10, centerY + 8, 20, 8);
						// Eye sockets
						ctx.fillStyle = "#1f2937";
						ctx.beginPath();
						ctx.arc(centerX - 6, centerY - 4, 5, 0, Math.PI * 2);
						ctx.arc(centerX + 6, centerY - 4, 5, 0, Math.PI * 2);
						ctx.fill();
						// Nose
						ctx.beginPath();
						ctx.moveTo(centerX, centerY + 2);
						ctx.lineTo(centerX - 3, centerY + 7);
						ctx.lineTo(centerX + 3, centerY + 7);
						ctx.closePath();
						ctx.fill();
						// Teeth
						ctx.fillStyle = "#1f2937";
						ctx.fillRect(centerX - 8, centerY + 10, 4, 4);
						ctx.fillRect(centerX - 2, centerY + 10, 4, 4);
						ctx.fillRect(centerX + 4, centerY + 10, 4, 4);
						break;
					case "coffee":
						// Brown coffee cup with steam
						ctx.fillStyle = "#92400e";
						ctx.fillRect(centerX - 10, centerY - 6, 20, 18);
						// Handle
						ctx.strokeStyle = "#78350f";
						ctx.lineWidth = 3;
						ctx.beginPath();
						ctx.arc(centerX + 13, centerY + 3, 6, -Math.PI / 2, Math.PI / 2);
						ctx.stroke();
						// Steam
						ctx.strokeStyle = "rgba(255,255,255,0.9)";
						ctx.lineWidth = 2;
						ctx.lineCap = "round";
						ctx.beginPath();
						ctx.moveTo(centerX - 5, centerY - 10);
						ctx.quadraticCurveTo(
							centerX - 8,
							centerY - 16,
							centerX - 5,
							centerY - 20
						);
						ctx.moveTo(centerX, centerY - 10);
						ctx.quadraticCurveTo(
							centerX + 3,
							centerY - 16,
							centerX,
							centerY - 20
						);
						ctx.moveTo(centerX + 5, centerY - 10);
						ctx.quadraticCurveTo(
							centerX + 8,
							centerY - 16,
							centerX + 5,
							centerY - 20
						);
						ctx.stroke();
						break;
					case "build":
						// Gear icon for build
						ctx.fillStyle = "#6b7280";
						ctx.strokeStyle = "#6b7280";
						ctx.lineWidth = 3;
						// Outer gear teeth
						ctx.beginPath();
						for (let i = 0; i < 8; i++) {
							const angle = (i * Math.PI) / 4;
							const innerR = radius * 0.6;
							const outerR = radius;
							const toothWidth = 0.25;
							// Tooth
							ctx.lineTo(
								centerX + Math.cos(angle - toothWidth) * innerR,
								centerY + Math.sin(angle - toothWidth) * innerR
							);
							ctx.lineTo(
								centerX + Math.cos(angle - toothWidth * 0.6) * outerR,
								centerY + Math.sin(angle - toothWidth * 0.6) * outerR
							);
							ctx.lineTo(
								centerX + Math.cos(angle + toothWidth * 0.6) * outerR,
								centerY + Math.sin(angle + toothWidth * 0.6) * outerR
							);
							ctx.lineTo(
								centerX + Math.cos(angle + toothWidth) * innerR,
								centerY + Math.sin(angle + toothWidth) * innerR
							);
						}
						ctx.closePath();
						ctx.fill();
						// Inner circle (hole)
						ctx.fillStyle = "#0a0a0f";
						ctx.beginPath();
						ctx.arc(centerX, centerY, radius * 0.25, 0, Math.PI * 2);
						ctx.fill();
						break;
					case "star":
						// Gold 5-point star
						ctx.fillStyle = "#fbbf24";
						ctx.beginPath();
						for (let i = 0; i < 10; i++) {
							const angle = (i * Math.PI) / 5 - Math.PI / 2;
							const r = i % 2 === 0 ? radius : radius * 0.4;
							const px = centerX + Math.cos(angle) * r;
							const py = centerY + Math.sin(angle) * r;
							if (i === 0) ctx.moveTo(px, py);
							else ctx.lineTo(px, py);
						}
						ctx.closePath();
						ctx.fill();
						break;
					case "merge":
						// Merge emoji
						ctx.font = `${obj.size - 10}px Arial`;
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						ctx.fillText("🔀", centerX, centerY);
						break;
					case "testpass":
						// Green checkmark for test pass
						ctx.fillStyle = "#22c55e";
						ctx.beginPath();
						ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
						ctx.fill();
						// Double checkmark
						ctx.strokeStyle = "#fff";
						ctx.lineWidth = 3;
						ctx.lineCap = "round";
						ctx.lineJoin = "round";
						// First check
						ctx.beginPath();
						ctx.moveTo(centerX - 12, centerY);
						ctx.lineTo(centerX - 6, centerY + 6);
						ctx.lineTo(centerX + 2, centerY - 6);
						ctx.stroke();
						// Second check (offset)
						ctx.beginPath();
						ctx.moveTo(centerX - 4, centerY);
						ctx.lineTo(centerX + 2, centerY + 6);
						ctx.lineTo(centerX + 12, centerY - 6);
						ctx.stroke();
						break;
				}

				ctx.restore();

				// Collision detection
				if (
					player.x < obj.x + obj.size &&
					player.x + player.width > obj.x &&
					player.y < obj.y + obj.size &&
					player.y + player.height > obj.y
				) {
					toRemove.push(index);

					if (["bug", "crash", "null", "404", "virus"].includes(obj.type)) {
						setLives((l) => {
							const newLives = l - 1;
							if (newLives <= 0) {
								setGameState("gameover");
								setShowNameInput(true);
								// Update high score
								setScore((currentScore) => {
									if (currentScore > highScore) {
										setHighScore(currentScore);
										localStorage.setItem(
											"bugDodgeHighScore",
											currentScore.toString()
										);
									}
									return currentScore;
								});
							}
							return newLives;
						});
					} else {
						// Good item collected
						let points = 5; // Default for coffee
						if (obj.type === "build") points = 10;
						if (obj.type === "star") points = 15;
						if (obj.type === "merge") points = 20;
						if (obj.type === "testpass") points = 25;
						setScore((s) => s + points);
					}
				}

				// Remove if off screen
				if (obj.y > canvas.height + 50) {
					toRemove.push(index);
				}
			});

			// Remove collected/off-screen objects
			objectsRef.current = objects.filter((_, i) => !toRemove.includes(i));

			// Draw UI - Score and Level on left, Lives and Time on right
			ctx.fillStyle = "#f86800";
			ctx.font = "bold 22px Arial";
			ctx.textAlign = "left";
			ctx.fillText(`Score: ${score}`, 20, 35);
			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
			ctx.font = "bold 18px Arial";
			ctx.fillText(`Level ${level}`, 20, 60);

			// Draw lives as hearts
			ctx.textAlign = "right";
			for (let i = 0; i < 3; i++) {
				const heartX = canvas.width - 30 - i * 30;
				const heartY = 28;
				ctx.fillStyle = i < lives ? "#ef4444" : "#374151";
				ctx.beginPath();
				ctx.moveTo(heartX, heartY + 5);
				ctx.bezierCurveTo(
					heartX,
					heartY,
					heartX - 8,
					heartY,
					heartX - 8,
					heartY + 5
				);
				ctx.bezierCurveTo(
					heartX - 8,
					heartY + 10,
					heartX,
					heartY + 15,
					heartX,
					heartY + 18
				);
				ctx.bezierCurveTo(
					heartX,
					heartY + 15,
					heartX + 8,
					heartY + 10,
					heartX + 8,
					heartY + 5
				);
				ctx.bezierCurveTo(
					heartX + 8,
					heartY,
					heartX,
					heartY,
					heartX,
					heartY + 5
				);
				ctx.fill();
			}

			// Format time as MM:SS
			const minutes = Math.floor(gameTime / 60);
			const seconds = gameTime % 60;
			const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
			ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
			ctx.font = "16px Arial";
			ctx.fillText(`Time: ${timeStr}`, canvas.width - 20, 60);

			if (gameState === "playing") {
				gameLoopRef.current = requestAnimationFrame(gameLoop);
			}
		};

		gameLoopRef.current = requestAnimationFrame(gameLoop);

		return () => {
			if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
		};
	}, [gameState, score, lives, level, highScore, gameTime]);

	// Save score to leaderboard
	const saveScore = () => {
		if (!playerName.trim()) return;

		const newEntry: LeaderboardEntry = {
			name: playerName.trim().slice(0, 10),
			score,
			date: new Date().toLocaleDateString(),
		};

		const newLeaderboard = [...leaderboard, newEntry]
			.sort((a, b) => b.score - a.score)
			.slice(0, 10);

		setLeaderboard(newLeaderboard);
		localStorage.setItem("bugDodgeLeaderboard", JSON.stringify(newLeaderboard));
		setShowNameInput(false);
		setPlayerName("");
	};

	return (
		<div className={styles.gameSection}>
			<h2 className={`${styles.gameTitle} font-array`}>Bug Dodge</h2>
			<p className={styles.gameSubtitle}>
				Dodge the bugs! Collect commits! Coffee heals the soul!
			</p>

			<div className={styles.gameContainer}>
				<div className={styles.gameWrapper}>
					<canvas
						ref={canvasRef}
						width={800}
						height={550}
						className={styles.gameCanvas}
					/>

					{gameState === "idle" && (
						<div className={styles.gameOverlay}>
							<h3 className="font-array">Ready to Code?</h3>
							<div className={styles.instructions}>
								<p>
									Use <span className={styles.key}>↑</span>
									<span className={styles.key}>↓</span>
									<span className={styles.key}>←</span>
									<span className={styles.key}>→</span> or{" "}
									<span className={styles.key}>W</span>
									<span className={styles.key}>A</span>
									<span className={styles.key}>S</span>
									<span className={styles.key}>D</span>
								</p>
								<div className={styles.legend}>
									<div className={styles.legendItem}>
										<div
											style={{
												display: "flex",
												gap: "6px",
												alignItems: "center",
											}}
										>
											<span style={{ fontSize: "14px" }}>🐛</span>
											<span style={{ color: "#ef4444", fontSize: "14px" }}>
												💥
											</span>
											<span style={{ color: "#a855f7", fontSize: "14px" }}>
												⊘
											</span>
											<span
												style={{
													fontSize: "11px",
													fontWeight: "bold",
													background: "#dc2626",
													padding: "2px 4px",
													borderRadius: "4px",
													color: "#fff",
												}}
											>
												404
											</span>
											<span style={{ color: "#6b7280", fontSize: "14px" }}>
												💀
											</span>
										</div>
										<span className={styles.bad}>Avoid! (-1 life)</span>
									</div>
									<div className={styles.legendItem}>
										<div
											style={{
												display: "flex",
												gap: "6px",
												alignItems: "center",
											}}
										>
											<span style={{ color: "#92400e", fontSize: "14px" }}>
												☕
											</span>
											<span style={{ color: "#6b7280", fontSize: "16px" }}>
												⚙️
											</span>
											<span style={{ color: "#fbbf24", fontSize: "16px" }}>
												★
											</span>
											<span style={{ color: "#3b82f6", fontSize: "16px" }}>
												🔀
											</span>
											<span
												style={{
													color: "#fff",
													fontSize: "10px",
													background: "#22c55e",
													borderRadius: "50%",
													width: "18px",
													height: "18px",
													display: "inline-flex",
													alignItems: "center",
													justifyContent: "center",
													fontWeight: "bold",
												}}
											>
												✓✓
											</span>
										</div>
										<span className={styles.good}>Collect! (+pts)</span>
									</div>
								</div>
							</div>
							<button className={styles.startButton} onClick={startGame}>
								Press Enter to Start
							</button>
						</div>
					)}

					{gameState === "gameover" && (
						<div className={styles.gameOverlay}>
							<h3 className="font-array">System Crashed!</h3>
							<p className={styles.finalScore}>Score: {score}</p>
							<p>High Score: {highScore}</p>

							{showNameInput ? (
								<div className={styles.nameInputContainer}>
									<input
										type="text"
										placeholder="Your name"
										value={playerName}
										onChange={(e) => setPlayerName(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") saveScore();
											e.stopPropagation();
										}}
										className={styles.nameInput}
										maxLength={10}
										autoFocus
									/>
									<button onClick={saveScore} className={styles.saveButton}>
										Save
									</button>
									<button
										onClick={() => setShowNameInput(false)}
										className={styles.skipButton}
									>
										Skip
									</button>
								</div>
							) : (
								<button className={styles.startButton} onClick={startGame}>
									Press Enter to Retry
								</button>
							)}
						</div>
					)}
				</div>

				{/* Leaderboard */}
				<div className={styles.leaderboard}>
					<h3 className={`${styles.leaderboardTitle} font-array`}>Top Devs</h3>
					{leaderboard.length === 0 ? (
						<p className={styles.noScores}>No scores yet!</p>
					) : (
						<ul className={styles.leaderboardList}>
							{leaderboard.map((entry, index) => (
								<li key={index} className={styles.leaderboardEntry}>
									<span
										className={styles.rank}
										style={{
											color:
												index === 0
													? "#fbbf24"
													: index === 1
													? "#9ca3af"
													: index === 2
													? "#cd7f32"
													: "#fff",
										}}
									>
										{index === 0
											? "1st"
											: index === 1
											? "2nd"
											: index === 2
											? "3rd"
											: `${index + 1}.`}
									</span>
									<span className={styles.entryName}>{entry.name}</span>
									<span className={styles.entryScore}>{entry.score}</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

// ============== MAIN PAGE COMPONENT ==============
export default function RecruitmentsClosedPage() {
	return (
		<div className={styles.container}>
			{/* Background */}
			<div className={styles.bgStars}></div>
			<div className={styles.bgGrid}></div>

			{/* Animated background orbs */}
			<div
				className={styles.orb}
				style={{ top: "10%", left: "10%", animationDelay: "0s" }}
			></div>
			<div
				className={styles.orb}
				style={{ top: "60%", right: "15%", animationDelay: "-3s" }}
			></div>
			<div
				className={styles.orb}
				style={{ bottom: "20%", left: "20%", animationDelay: "-6s" }}
			></div>

			{/* Main Content */}
			<main className={styles.main}>
				{/* Floating Letters - Full viewport */}
				<FloatingLetters />

				{/* Message Box */}
				<section className={styles.heroSection}>
					<motion.div
						className={styles.messageBox}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.8, duration: 0.6 }}
					>
						<p>🎉 Recruitments are now closed!</p>
						<p className={styles.messageSmall}>
							While you wait for results, enjoy our mini game below 👇
						</p>
					</motion.div>
				</section>

				{/* Game Section */}
				<motion.section
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1, duration: 0.8 }}
				>
					<BugDodgeGame />
				</motion.section>

				{/* Footer */}
				<motion.footer
					className={styles.footer}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2 }}
				>
					<p className="font-khand">Made with 💙 by the Recruitment Team</p>
				</motion.footer>
			</main>
		</div>
	);
}
