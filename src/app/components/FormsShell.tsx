"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Clock from "./clock";

interface FormsShellProps {
	children: React.ReactNode;
}

export default function FormsShell({ children }: FormsShellProps) {
	const router = useRouter();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	return (
		<main className="flex-col min-h-screen bg-black h-screen w-screen max-h-screen max-w-screen p-[2%]">
			{/* Header */}
		<header className="flex items-center justify-between mb-8 w-full h-[10%] px-7">
			<div className="flex items-center gap-2">
				<Image src="/VIIT 2.svg" alt="VinnovatIT" height={150} width={150} />
			</div>
			<div className="flex items-center gap-4">
					<button 
						onClick={() => router.push("/dashboard")}
						className="px-4 py-2 bg-white rounded-2xl text-black font-khand text-lg hover:bg-gray-100 transition-colors"
					>
						Go To Home
					</button>
					<div className="relative" ref={menuRef}>
						<button
							onClick={() => setIsProfileOpen(!isProfileOpen)}
							className="text-white hover:text-amber-500 transition-colors rounded-full bg-neutral-800 p-1"
							aria-label="Profile Menu"
							aria-expanded={isProfileOpen}
							aria-haspopup="true"
						>
							<svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
							</svg>
						</button>

						{isProfileOpen && (
							<div className="absolute left-0 mt-2 w-40 py-1 bg-[#FFFFFF99] rounded-lg shadow-xl z-50 text-black font-khand text-lg">
								<button 
									onClick={() => {
										setIsProfileOpen(false);
										router.push("/profile");
									}}
									className="w-full text-left px-3 py-1.5 hover:bg-gray-100"
								>
									Update Details
								</button>
								<button 
									onClick={() => {
										setIsProfileOpen(false);
										signOut({ callbackUrl: "/login" });
									}}
									className="w-full text-left px-3 py-1.5 hover:bg-gray-100"
								>
									Logout
								</button>
							</div>
						)}
					</div>
					<div className="h-full flex items-center">
						<Clock />
					</div>
				</div>
			</header>

			{/* Main Card */}
			<section className="flex-col bg-white w-full h-[80%] rounded-4xl text-black font-khand">
				<div className="h-full overflow-y-auto">
					{children}
				</div>
			</section>
		</main>
	);
}
