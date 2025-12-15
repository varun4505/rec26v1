"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Clock from "./clock";
import { MobileRestriction } from "@/components/MobileRestriction";
import { useSession } from "next-auth/react";
import UserDropdown from '@/app/dashboard/components/UserDropdown';
import styles from '@/app/dashboard/Dashboard.module.css';

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
					
        {/* --- Wrapper for menu and button --- */}
        <div className={styles.userMenuWrapper} ref={menuRef}>
          <div
            className={styles.userInitialCircle}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{ overflow: 'hidden' }}
          >
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={34}
                height={34}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              userInitial
            )}
          </div>

          {/* --- Conditionally render the dropdown --- */}
          {isProfileOpen && <UserDropdown />}
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
