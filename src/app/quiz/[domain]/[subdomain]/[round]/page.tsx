"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FormsShell from "../../../../components/FormsShell";
import {
	SubjectiveQuestion,
} from "../../../../components/question_types";
import { getQuizConfig } from "@/data/quizConfig";
import { validateDomainSubmission, type DomainType, type RoundType } from "@/data/domainConfig";

// Helper function to format subdomain names
function formatSubdomainName(subdomain: string | null): string {
	if (!subdomain) return '';
	return subdomain
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

// Helper function to format domain names
function formatDomainName(domain: string): string {
	const domainMap: Record<string, string> = {
		'tech': 'Technical',
		'management': 'Management',
		'design': 'Design',
	};
	return domainMap[domain] || domain;
}

// Note: Quiz configurations moved to @/data/quizConfig
/*
OLD CODE REMOVED - keeping comment for reference
const quizConfigs = {
	tech: {
		"web-development": {
			"1": {
				type: "subjective",
				subjectiveQuestions: [
					{
						id: "web-dev-r1-q1",
						prompt:
							"Explain the difference between var, let, and const in JavaScript.",
						placeholder: "Type your explanation here...",
						helperText: "Consider scope, hoisting, and reassignment behavior.",
					},
					{
						id: "web-dev-r1-q2",
						prompt:
							"What is the virtual DOM and how does it improve performance?",
						placeholder: "Type your answer here...",
						helperText: "Explain the concept and its benefits.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "web-dev-r2-prompt",
					prompt: "Submit your web development project",
					description:
						"Share your GitHub repository, deployment link, and any additional resources.",
					variant: "repoStack",
				},
			},
		},
		"app-development": {
			"1": {
				type: "subjective",
				subjectiveQuestions: [
					{
						id: "app-dev-r1-q1",
						prompt:
							"Compare React Native and Flutter for mobile app development.",
						placeholder: "Type your comparison here...",
						helperText:
							"Consider performance, development experience, and ecosystem.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "app-dev-r2-prompt",
					prompt: "Submit your mobile app project",
					description:
						"Share your project repository, app store links, and documentation.",
					variant: "repoStack",
				},
			},
		},
		"ai-ml": {
			"1": {
				type: "subjective",
				subjectiveQuestions: [
					{
						id: "ai-ml-r1-q1",
						prompt:
							"Explain the difference between supervised and unsupervised learning.",
						placeholder: "Type your explanation here...",
						helperText: "Include examples and use cases for each.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "ai-ml-r2-prompt",
					prompt: "Submit your AI/ML project",
					description:
						"Share your project repository, deployed model, and documentation.",
					variant: "repoStack",
				},
			},
		},
	},
	design: {
		"ui-ux-design": {
			"1": {
				type: "subjective",
				subjectiveQuestions: [
					{
						id: "ui-ux-r1-q1",
						prompt: "What are the key principles of good UX design?",
						placeholder: "Type your answer here...",
						helperText:
							"Consider usability, accessibility, and user satisfaction.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "ui-ux-r2-prompt",
					prompt: "Submit your design portfolio",
					description:
						"Share your Figma files, design documentation, and any additional resources.",
					variant: "designAssets",
				},
			},
		},
		"graphic-design": {
			"1": {
				type: "subjective",
				subjectiveQuestions: [
					{
						id: "graphic-r1-q1",
						prompt: "Explain the importance of typography in graphic design.",
						placeholder: "Type your explanation here...",
						helperText:
							"Consider readability, hierarchy, and brand consistency.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "graphic-r2-prompt",
					prompt: "Submit your graphic design portfolio",
					description: "Share your design files and portfolio documentation.",
					variant: "designAssets",
				},
			},
		},
		"motion-graphics": {
			"1": {
				type: "subjective",
				subjectiveQuestions: [
					{
						id: "motion-r1-q1",
						prompt:
							"What are the 12 principles of animation and their importance?",
						placeholder: "Type your answer here...",
						helperText:
							"Explain how these principles apply to motion graphics.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "motion-r2-prompt",
					prompt: "Submit your motion graphics work",
					description:
						"Share your video files, project files, and documentation.",
					variant: "driveAssets",
				},
			},
		},
	},
	management: {
		"event-management": {
			"1": {
				type: "subjective",
				subjectiveQuestions: [
					{
						id: "event-r1-q1",
						prompt: "How do you handle last-minute changes in event planning?",
						placeholder: "Type your approach here...",
						helperText:
							"Consider communication, contingency planning, and stakeholder management.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "event-r2-prompt",
					prompt: "Submit your event management portfolio",
					description:
						"Share documentation, photos, and resources from events you've managed.",
					variant: "driveAssets",
				},
			},
		},
		marketing: {
			"1": {
				type: "subjective",
				subjectiveQuestions: [
					{
						id: "marketing-r1-q1",
						prompt:
							"Explain the difference between B2B and B2C marketing strategies.",
						placeholder: "Type your explanation here...",
						helperText:
							"Consider target audience, channels, and messaging differences.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "marketing-r2-prompt",
					prompt: "Submit your marketing campaign",
					description:
						"Share campaign materials, analytics, and documentation.",
					variant: "driveAssets",
				},
			},
		},
		"content-writing": {
			"1": {
				type: "subjective",
				subjectiveQuestions: [
					{
						id: "content-r1-q1",
						prompt:
							"How do you adapt your writing style for different audiences?",
						placeholder: "Type your approach here...",
						helperText: "Consider tone, complexity, and format adjustments.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "content-r2-prompt",
					prompt: "Submit your writing portfolio",
					description:
						"Share your writing samples and portfolio documentation.",
					variant: "driveAssets",
				},
			},
		},
	},
};
*/

export default function QuizPage() {
	const params = useParams();
	const router = useRouter();
	const { data: session, status: sessionStatus } = useSession();
	const [accessCheck, setAccessCheck] = useState<{
		loading: boolean;
		canAccess: boolean;
		reason: string;
		round1Status?: any;
	}>({
		loading: true,
		canAccess: false,
		reason: "Checking access...",
	});

	const { domain, subdomain, round } = params;
	const subdomainStr = (subdomain as string) === 'none' ? null : (subdomain as string);

	// Check round access on mount
	useEffect(() => {
		if (sessionStatus === "loading") return;
		
		if (!session?.user?.email) {
			router.push("/login");
			return;
		}

		checkRoundAccess();
	}, [session, sessionStatus, domain, subdomain, round]);

	const checkRoundAccess = async () => {
		try {
			const queryParams = new URLSearchParams({
				domain: domain as string,
				subdomain: (subdomain as string) || 'none',
				round: `round${round}`,
			});

			const response = await fetch(`/api/round-access?${queryParams}`);
			const result = await response.json();

			if (result.success) {
				setAccessCheck({
					loading: false,
					canAccess: result.canAccess,
					reason: result.reason,
					round1Status: result.round1Status,
				});
			} else {
				setAccessCheck({
					loading: false,
					canAccess: false,
					reason: result.error || "Access check failed",
				});
			}
		} catch (err) {
			console.error("Error checking access:", err);
			setAccessCheck({
				loading: false,
				canAccess: false,
				reason: "Failed to verify access",
			});
		}
	};

	// Get quiz configuration
	const config = getQuizConfig(domain as string, subdomainStr, round as string);

	// Show loading while checking session or access
	if (sessionStatus === "loading" || accessCheck.loading) {
		return (
			<FormsShell>
				<div className="flex items-center justify-center h-full">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8F6B] mx-auto mb-4"></div>
						<p className="text-gray-600">Loading...</p>
					</div>
				</div>
			</FormsShell>
		);
	}

	// Show access denied message
	if (!accessCheck.canAccess) {
		return (
			<FormsShell>
				<div className="flex items-center justify-center h-full">
					<div className="max-w-md text-center bg-white rounded-2xl p-8 shadow-lg">
						<div className="text-6xl mb-4">🔒</div>
						<h1 className="text-2xl font-bold mb-4">Access Denied</h1>
						<p className="text-gray-600 mb-6">{accessCheck.reason}</p>
						{accessCheck.round1Status && (
							<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
								<p className="font-semibold mb-2">Round 1 Status:</p>
								<p className="text-sm text-gray-700">
									{accessCheck.round1Status.feedback || "Awaiting evaluation from admin"}
								</p>
							</div>
						)}
						<button
							onClick={() => router.push("/dashboard")}
							className="rounded-full bg-gradient-to-r from-[#FFB37A] to-[#FF8F6B] px-6 py-2 text-white font-semibold hover:shadow-lg transition-all"
						>
							Back to Dashboard
						</button>
					</div>
				</div>
			</FormsShell>
		);
	}

	if (!config) {
		return (
			<FormsShell>
				<div className="flex items-center justify-center h-full">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
						<p className="text-gray-600">
							No quiz configured for {domain}/{subdomain}/round-{round}
						</p>
						<button
							onClick={() => router.push("/dashboard")}
							className="mt-4 rounded-full bg-gradient-to-r from-[#FFB37A] to-[#FF8F6B] px-6 py-2 text-white font-semibold"
						>
							Back to Dashboard
						</button>
					</div>
				</div>
			</FormsShell>
		);
	}

	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [submissionUrl, setSubmissionUrl] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleAnswerChange = (questionId: string, value: string) => {
		setAnswers(prev => ({ ...prev, [questionId]: value }));
	};

	const handleSubmit = async () => {
		setError(null);
		
		// Validate that all questions are answered
		if (config.type === 'questionnaire' && config.questions) {
			const unanswered = config.questions.filter(q => !answers[q.id]);
			if (unanswered.length > 0) {
				setError(`Please answer all questions before submitting.`);
				return;
			}
		}

		// Validate task submission
		if (config.type === 'task' && !submissionUrl.trim()) {
			setError('Please provide a submission URL for your task.');
			return;
		}

		setIsSubmitting(true);

		try {
			// Prepare submission data
			const answersList = config.type === 'questionnaire' && config.questions
				? config.questions.map(q => ({
						id: q.id,
						question: q.prompt,
						answer: answers[q.id] || ''
				  }))
				: [];

			const submissionData = {
				basicInfo: {
					name: session?.user?.name || '',
					registrationNumber: session?.user?.email?.split('@')[0]?.toUpperCase() || '',
					mobileNumber: '0000000000',
				},
				domains: [{
					domain: domain,
					subdomain: subdomainStr || undefined,
					round: `round${round}`,
					data: {
						answers: answersList
					},
					submissionUrl: submissionUrl || undefined
				}]
			};

			const response = await fetch('/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(submissionData),
			});

			const result = await response.json();

			if (result.success) {
				router.push('/dashboard');
			} else {
				setError(result.error || 'Submission failed. Please try again.');
			}
		} catch (err) {
			console.error('Submission error:', err);
			setError('An error occurred while submitting. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const getTitle = () => {
		if (subdomainStr) {
			return formatSubdomainName(subdomainStr);
		}
		return formatDomainName(domain as string);
	};

	return (
		<FormsShell>
			<div className="flex flex-col gap-10 p-8">
				<article className="flex flex-col gap-6 rounded-[32px] border border-white/20 bg-gradient-to-br from-[#FFF4EC] via-[#F7F5FF] to-[#EAF3FF] p-8 shadow-[0_25px_60px_rgba(15,15,15,0.25)]">
					<header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-3xl font-semibold sm:text-4xl">
								{getTitle()}
							</h2>
							<p className="text-lg text-black/60 sm:text-xl">Round {round}</p>
						</div>
						<div className="text-right text-black/60">
							<p className="text-sm sm:text-base">{session?.user?.email}</p>
						</div>
					</header>

					<div className="flex flex-col gap-6 rounded-[28px] bg-[#F7B58D]/40 p-6">
						{/* Render questionnaire questions */}
						{config.type === 'questionnaire' && config.questions && (
							<>
								{config.questions.map((question) => (
									<SubjectiveQuestion
										key={question.id}
										id={question.id}
										prompt={question.prompt}
										placeholder={question.placeholder}
										helperText={question.helperText}
										value={answers[question.id] || ''}
										onChange={(value) => handleAnswerChange(question.id, value)}
									/>
								))}
							</>
						)}

						{/* Render task submissions */}
						{config.type === 'task' && config.tasks && (
							<>
								<div className="space-y-6">
									<h3 className="text-xl font-semibold">Choose a Task to Submit</h3>
									{config.tasks.map((task) => (
										<div key={task.id} className="bg-white/50 rounded-2xl p-6 space-y-4">
											<h4 className="text-lg font-semibold">{task.title}</h4>
											<p className="text-black/70">{task.description}</p>
											<div className="space-y-2">
												<p className="font-medium">Instructions:</p>
												<ul className="list-disc list-inside space-y-1 text-black/70">
													{task.instructions.map((instruction, idx) => (
														<li key={idx}>{instruction}</li>
													))}
												</ul>
											</div>
											{task.helperText && (
												<p className="text-sm text-black/60 italic">{task.helperText}</p>
											)}
										</div>
									))}
								</div>

								<div className="space-y-2">
									<label className="block text-lg font-medium">
										Submission URL {config.tasks[0]?.submissionType === 'document' ? '(Google Drive/Dropbox)' : ''}
									</label>
									<input
										type="url"
										value={submissionUrl}
										onChange={(e) => setSubmissionUrl(e.target.value)}
										placeholder="https://..."
										className="w-full px-4 py-3 rounded-xl border border-black/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]"
									/>
									<p className="text-sm text-black/60">
										{config.tasks[0]?.submissionType === 'link' && 'Provide a link to your repository, deployed app, or project'}
										{config.tasks[0]?.submissionType === 'document' && 'Provide a link to your document or portfolio (make sure it\'s publicly accessible)'}
										{config.tasks[0]?.submissionType === 'both' && 'Provide a link to your project, repository, or portfolio'}
									</p>
								</div>
							</>
						)}

						{error && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
								{error}
							</div>
						)}

						<div className="flex justify-center pt-2">
							<button
								type="button"
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="rounded-full bg-gradient-to-r from-[#FFB37A] to-[#FF8F6B] px-8 py-3 text-base font-semibold text-white shadow-[0_10px_25px_rgba(255,143,107,0.35)] hover:shadow-[0_15px_35px_rgba(255,143,107,0.45)] transition-all disabled:opacity-50 disabled:cursor-not-started"
							>
								{isSubmitting ? 'Submitting...' : 'Submit'}
							</button>
						</div>
					</div>
				</article>
			</div>
		</FormsShell>
	);
}
