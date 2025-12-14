"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Clock from "./clock";
import { MobileRestriction } from "@/components/MobileRestriction";
import { useSession } from "next-auth/react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

interface FormsShellProps {
	children: React.ReactNode;
}

export default function FormsShell({ children }: FormsShellProps) {
	const router = useRouter();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const { data: session, status } = useSession();
	
  const rawName = session?.user?.name || "User";
  const userName = rawName
    .replace(/\b(21|22|23|24|25|26)[A-Za-z0-9]*$/, "")
    .trim();

  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

	return (
		<>
			{/* Mobile Restriction - Only shows on mobile */}
			<MobileRestriction />

			{/* Desktop View */}
			<main className="flex-col min-h-screen bg-black h-screen w-screen max-h-screen max-w-screen p-[2%] desktop-only">
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
							<div className="avatar-monogram" style={{ overflow: "hidden" }}>
										  {userImage ? (
											<Image
											  src={userImage}
											  alt={userName}
											  width={34}
											  height={34}
											  style={{ borderRadius: "50%", objectFit: "cover" }}
											/>
										  ) : (
											userInitial
										  )}
										</div>
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

		<style jsx global>{`
			/* Responsive Styles */
			@media (max-width: 1400px) {
				main {
					padding: 1.5%;
				}

				header {
					margin-bottom: 1.5rem;
					padding: 0 1.5rem;
				}

				header img {
					width: 130px !important;
					height: auto !important;
				}

				header button {
					padding: 0.5rem 1rem;
					font-size: 1rem;
				}
			}

			@media (max-width: 1200px) {
				main {
					padding: 1.2%;
				}

				header {
					margin-bottom: 1.2rem;
					padding: 0 1rem;
					height: auto;
					min-height: 60px;
				}

				header img {
					width: 110px !important;
				}

				header button {
					padding: 0.4rem 0.8rem;
					font-size: 0.9rem;
				}

				section {
					height: calc(100% - 80px) !important;
				}
			}

			/* Hide desktop view on mobile */
			@media (max-width: 900px) {
				.desktop-only {
					display: none !important;
				}
			}
		`}</style>
		</>
	);
}
