import type { Metadata } from "next";
import localFont from "next/font/local";
import { Khand } from "next/font/google";
import "./globals.css";
import FooterConditional from "./components/FooterConditional";
import { SessionProvider } from "./components/SessionProvider";
import CustomCursor from "../components/CustomCursor";
import NextTopLoader from "nextjs-toploader";

const arrayFont = localFont({
	src: [
		{
			path: "../../public/fonts/array/Array-Regular.woff2",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-array",
	display: "swap",
});

const khandFont = Khand({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-khand",
	display: "swap",
});

export const metadata: Metadata = {
	title: "VinnovateIT Recruitments",
	description: "The next step advancement in your career",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${arrayFont.variable} ${khandFont.variable} antialiased font-khand flex flex-col min-h-screen`}
			>
				<NextTopLoader
					color="#f86800"
					initialPosition={0.08}
					crawlSpeed={200}
					height={3}
					crawl={true}
					showSpinner={false}
					easing="ease"
					speed={200}
					shadow="0 0 10px #f86800,0 0 5px #f86800"
				/>
				
				<CustomCursor />
				<SessionProvider>
					<div className="grow">{children}</div>
					<FooterConditional />
				</SessionProvider>
			</body>
		</html>
	);
}