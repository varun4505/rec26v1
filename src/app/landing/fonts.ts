import { Caveat, Geist, Geist_Mono, Silkscreen } from "next/font/google";

export const geistSans = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
	display: "swap",
});

export const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
	display: "swap",
});

export const pixelFont = Silkscreen({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-pixel",
	display: "swap",
});

export const handFont = Caveat({
	subsets: ["latin"],
	weight: ["500", "700"],
	variable: "--font-hand",
	display: "swap",
});

export const landingFontVars = [geistSans, geistMono, pixelFont, handFont]
	.map((font) => font.variable)
	.join(" ");
