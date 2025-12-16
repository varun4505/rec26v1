"use client";

import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";

interface FormsShellProps {
	children: React.ReactNode;
}

export default function FormsShell({ children }: FormsShellProps) {
	const router = useRouter();

	const ActionButton = (
		<button 
			onClick={() => router.push("/dashboard")}
			style={{
				backgroundColor: '#FFFFFF',
				color: '#000000',
				border: 'none',
				padding: '8px 20px',
				borderRadius: '13px',
				fontFamily: 'var(--font-khand)',
				fontSize: '15px',
				fontWeight: '400',
				cursor: 'pointer',
				transition: 'background-color 0.2s ease',
				whiteSpace: 'nowrap'
			}}
		>
			Dashboard
		</button>
	);

	return (
		<PageLayout actionButton={ActionButton}>
				{children}
		</PageLayout>
	);
}