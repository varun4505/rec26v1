"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FormsShell from "../../../../components/FormsShell";
import {
	SubjectiveQuestion,
} from "../../../../components/question_types";
import { validateDomainSubmission, getRoundInfo, type DomainType, type RoundType } from "@/data/domainConfig";
import AlertModal from "@/components/AlertModal";

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

	// All useState hooks must be at the top, before any conditional returns
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [questions, setQuestions] = useState<any[]>([]);
	const [questionsLoading, setQuestionsLoading] = useState(true);
	const [tasks, setTasks] = useState<any[]>([]);
	const [tasksLoading, setTasksLoading] = useState(true);
	const [taskSubmissionUrl, setTaskSubmissionUrl] = useState<string>('');
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const [alertModal, setAlertModal] = useState<{isOpen: boolean; title: string; message: string}>({
		isOpen: false,
		title: "",
		message: ""
	});

	// Generate unique cache key for this quiz attempt
	const cacheKey = `quiz_${domain}_${subdomain}_${round}_${session?.user?.email}`;

	// Load existing submission or cached answers on mount
	useEffect(() => {
		const loadExistingData = async () => {
			try {
				// First, try to fetch existing submission from database
				const domainSlugMap: Record<string, string> = {
					'tech': 'technical',
					'management': 'management',
					'design': 'design',
				};
				const fullDomainId = domainSlugMap[domain as string] || (domain as string);
				const roundParam = (round as string).startsWith('round') 
					? (round as string) 
					: `round${round}`;

				const queryParams = new URLSearchParams({
					domain: fullDomainId,
					subdomain: (subdomain as string) || 'none',
					round: roundParam,
				});

				const response = await fetch(`/api/submission?${queryParams}`);
				const result = await response.json();

				console.log('Fetched submission result:', result);

				if (result.success && result.submission) {
					console.log('Submission answers raw:', result.submission.answers);
					
					// For task submissions, just set the URL
					if (result.submission.submissionUrl) {
						setTaskSubmissionUrl(result.submission.submissionUrl);
						console.log('Loaded task submission URL:', result.submission.submissionUrl);
						return;
					}
					
					// For question submissions, we need to fetch questions first to match answers
					// Store the raw answers temporarily and map them after questions are loaded
					if (result.submission.answers && Array.isArray(result.submission.answers)) {
						// Store raw answers in a temporary variable
						(window as any).__pendingAnswers = result.submission.answers;
						console.log('Stored pending answers, will map after questions load');
					}
					return; // Don't load from cache if we have database data
				}

				// If no database submission, fall back to localStorage cache
				if (typeof window !== 'undefined') {
					const cached = localStorage.getItem(cacheKey);
					if (cached) {
						try {
							const parsed = JSON.parse(cached);
							setAnswers(parsed.answers || {});
							setTaskSubmissionUrl(parsed.taskSubmissionUrl || '');
							setLastSaved(parsed.savedAt ? new Date(parsed.savedAt) : null);
							console.log('Loaded from cache:', parsed.answers);
						} catch (err) {
							console.error('Error loading cached answers:', err);
						}
					}
				}
			} catch (err) {
				console.error('Error loading existing data:', err);
				// Fall back to localStorage on error
				if (typeof window !== 'undefined') {
					const cached = localStorage.getItem(cacheKey);
					if (cached) {
						try {
							const parsed = JSON.parse(cached);
							setAnswers(parsed.answers || {});
							setTaskSubmissionUrl(parsed.taskSubmissionUrl || '');
							setLastSaved(parsed.savedAt ? new Date(parsed.savedAt) : null);
						} catch (err) {
							console.error('Error loading cached answers:', err);
						}
					}
				}
			}
		};

		if (session?.user?.email) {
			loadExistingData();
		}
	}, [cacheKey, domain, subdomain, round, session, subdomainStr]);

	// Auto-save answers to localStorage with debouncing
	useEffect(() => {
		if (typeof window !== 'undefined' && (Object.keys(answers).length > 0 || taskSubmissionUrl)) {
			const timer = setTimeout(() => {
				const dataToSave = {
					answers,
					taskSubmissionUrl,
					savedAt: new Date().toISOString(),
				};
				localStorage.setItem(cacheKey, JSON.stringify(dataToSave));
				setLastSaved(new Date());
			}, 500); // Debounce for 500ms

			return () => clearTimeout(timer);
		}
	}, [answers, taskSubmissionUrl, cacheKey]);

	// Check round access on mount
	useEffect(() => {
		if (sessionStatus === "loading") return;
		
		if (!session?.user?.email) {
			router.push("/login");
			return;
		}

		checkRoundAccess();
	}, [session, sessionStatus, domain, subdomain, round]);

	// Fetch questions or tasks from database
	useEffect(() => {
		const fetchContent = async () => {
			try {
				// Convert domain slug to full domain ID
				const domainSlugMap: Record<string, string> = {
					'tech': 'technical',
					'management': 'management',
					'design': 'design',
				};
				const fullDomainId = domainSlugMap[domain as string] || (domain as string);
				
				// Ensure round has "round" prefix
				const roundParam = (round as string).startsWith('round') 
					? (round as string) 
					: `round${round}`;
				
				// Check if this round is a task round
				const roundInfo = getRoundInfo(fullDomainId as DomainType, roundParam as RoundType);
				const isTaskRound = roundInfo?.type === 'task';
				
				const queryParams = new URLSearchParams({
					domain: fullDomainId,
					subdomain: (subdomain as string) || 'none',
					round: roundParam,
				});

				if (isTaskRound) {
					// Fetch tasks
					setTasksLoading(true);
					setQuestionsLoading(false); // Not loading questions
					const response = await fetch(`/api/tasks?${queryParams}`);
					const result = await response.json();

					if (result.success) {
						setTasks(result.tasks);
					} else {
						setError(result.error || "Failed to load tasks");
					}
					setTasksLoading(false);
				} else {
					// Fetch questions
					setQuestionsLoading(true);
					setTasksLoading(false); // Not loading tasks
					const response = await fetch(`/api/questions?${queryParams}`);
					const result = await response.json();

					if (result.success) {
						setQuestions(result.questions);
						
						// Map pending answers to questions if they exist
						const pendingAnswers = (window as any).__pendingAnswers;
						if (pendingAnswers && Array.isArray(pendingAnswers)) {
							const mappedAnswers: Record<string, string> = {};
							result.questions.forEach((question: any, index: number) => {
								if (pendingAnswers[index] && pendingAnswers[index].answer !== undefined) {
									mappedAnswers[question.id] = String(pendingAnswers[index].answer);
								}
							});
							setAnswers(mappedAnswers);
							console.log('Mapped answers to questions:', mappedAnswers);
							// Clear pending answers
							delete (window as any).__pendingAnswers;
						}
					} else {
						setError(result.error || "Failed to load questions");
					}
					setQuestionsLoading(false);
				}
			} catch (err) {
				console.error("Error fetching content:", err);
				setError("Failed to load content");
				setQuestionsLoading(false);
				setTasksLoading(false);
			}
		};

		if (accessCheck.canAccess && !accessCheck.loading) {
			fetchContent();
		}
	}, [domain, subdomain, round, accessCheck.canAccess, accessCheck.loading]);

	const checkRoundAccess = async () => {
		try {
			// Convert domain slug to full domain ID
			const domainSlugMap: Record<string, string> = {
				'tech': 'technical',
				'management': 'management',
				'design': 'design',
			};
			const fullDomainId = domainSlugMap[domain as string] || (domain as string);
			
			// Ensure round has "round" prefix, but don't double it
			const roundParam = (round as string).startsWith('round') 
				? (round as string) 
				: `round${round}`;
			
			const queryParams = new URLSearchParams({
				domain: fullDomainId,
				subdomain: (subdomain as string) || 'none',
				round: roundParam,
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

	// Show loading while fetching questions/tasks (only after access is granted)
	if (questionsLoading || tasksLoading) {
		return (
			<FormsShell>
				<div className="flex items-center justify-center h-full">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8F6B] mx-auto mb-4"></div>
						<p className="text-gray-600">Loading questions...</p>
					</div>
				</div>
			</FormsShell>
		);
	}

	// Determine if this is a task round
	const domainSlugMap: Record<string, string> = {
		'tech': 'technical',
		'management': 'management',
		'design': 'design',
	};
	const fullDomainId = domainSlugMap[domain as string] || (domain as string);
	const roundParam = (round as string).startsWith('round') 
		? (round as string) 
		: `round${round}`;
	const roundInfo = getRoundInfo(fullDomainId as DomainType, roundParam as RoundType);
	const isTaskRound = roundInfo?.type === 'task';

	// Show message if no content found
	if (!questionsLoading && !tasksLoading) {
		if (isTaskRound && tasks.length === 0) {
			return (
				<FormsShell>
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<h1 className="text-2xl font-bold mb-4">No Tasks Available</h1>
							<p className="text-gray-600">
								No tasks have been added for this round yet.
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
		if (!isTaskRound && questions.length === 0) {
			return (
				<FormsShell>
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<h1 className="text-2xl font-bold mb-4">No Questions Available</h1>
							<p className="text-gray-600">
								No questions have been added for this round yet.
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
	}

	const handleAnswerChange = (questionId: string, value: string) => {
		setAnswers(prev => ({ ...prev, [questionId]: value }));
		// Auto-save will be triggered by useEffect
	};

	const handleTaskUrlChange = (value: string) => {
		setTaskSubmissionUrl(value);
		// Auto-save will be triggered by useEffect
	};

	const handleSubmit = async () => {
		setError(null);
		
		// Debug: Log session data
		console.log('Session data:', session);
		console.log('Email:', session?.user?.email);
		console.log('Name:', session?.user?.name);
		
		// Validate based on round type
		if (isTaskRound) {
			// For task rounds, validate submission URL
			if (!taskSubmissionUrl.trim()) {
				setError('Please provide a submission URL for the task.');
				return;
			}
			// Basic URL validation - add protocol if missing
			let urlToValidate = taskSubmissionUrl.trim();
			if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
				urlToValidate = 'https://' + urlToValidate;
			}
			try {
				new URL(urlToValidate);
				// Update the state with the corrected URL
				setTaskSubmissionUrl(urlToValidate);
			} catch {
				setError('Please enter a valid URL (e.g., github.com/username/repo or https://github.com/username/repo)');
				return;
			}
		} else {
			// For question rounds, validate that all required questions are answered
			if (questions.length > 0) {
				const unansweredRequired = questions.filter(q => !q.isOptional && !answers[q.id]);
				if (unansweredRequired.length > 0) {
					setError(`Please answer all required questions before submitting.`);
					return;
				}
			}
		}

		setIsSubmitting(true);

			try {
			// Prepare submission data
			const answersList = isTaskRound ? [] : questions.map(q => ({
				id: q.id,
				question: q.text,
				answer: answers[q.id] || ''
			}));

			// Convert domain slug to full domain ID
			const domainSlugMap: Record<string, string> = {
				'tech': 'technical',
				'management': 'management',
				'design': 'design',
			};
			const fullDomainId = domainSlugMap[domain as string] || (domain as string);
			
			// Ensure round has "round" prefix, but don't double it
			const roundParam = (round as string).startsWith('round') 
				? (round as string) 
				: `round${round}`;
			
			// Extract registration number from user's name (format: "Varun B 23MID0026")
			const fullName = session?.user?.name || '';
			const regNoMatch = fullName.match(/([0-9]{2}[A-Z]{3}[0-9]{4})/);
			const registrationNumber = regNoMatch ? regNoMatch[1] : '';
			
			// Extract name by removing registration number from full name
			const userName = fullName.replace(registrationNumber, '').trim();
			
			console.log('Extracted data:', {
				fullName,
				registrationNumber,
				userName,
			});
			
			const submissionData = {
				basicInfo: {
					name: userName,
					registrationNumber: registrationNumber,
					mobileNumber: '0000000000',
				},
				domains: [{
					domain: fullDomainId,
					subdomain: subdomainStr || undefined,
					round: roundParam,
					data: isTaskRound ? {
						submissionUrl: taskSubmissionUrl
					} : {
						answers: answersList
					}
				}]
			};
			
			console.log('Submission data:', JSON.stringify(submissionData, null, 2));			const response = await fetch('/api/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(submissionData),
			});

			const result = await response.json();
			console.log('API Response:', result);

			if (result.success) {
				// Clear cached answers after successful submission
				if (typeof window !== 'undefined') {
					localStorage.removeItem(cacheKey);
				}
				// Show success message
			setAlertModal({
				isOpen: true,
				title: "Success",
				message: "Submission successful! You can resubmit before the deadline if needed."
			});
			// Redirect to dashboard after a short delay
			setTimeout(() => {
				router.push('/dashboard');
			}, 2000);
			} else {
				console.error('Submission failed:', result.error);
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

	const getRoundNumber = () => {
		const roundStr = round as string;
		if (roundStr.startsWith('round')) {
			return roundStr.replace('round', '');
		}
		return roundStr;
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
							<p className="text-lg text-black/60 sm:text-xl">Round {getRoundNumber()}</p>
						</div>
						<div className="text-right text-black/60">
							<p className="text-sm sm:text-base">{session?.user?.email}</p>
						</div>
					</header>

				<div className="flex flex-col gap-6 rounded-[28px] bg-[#F7B58D]/40 p-6">
					{/* Render tasks for task rounds */}
					{isTaskRound && tasks.length > 0 && (
						<>
							{tasks.map((task: any) => (
								<div key={task.id} className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-md">
									<div>
										<h3 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h3>
										<p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
									</div>
									{task.link && (
										<div className="flex items-center gap-2">
											<span className="font-semibold text-gray-700">Task Link:</span>
											<a 
												href={task.link} 
												target="_blank" 
												rel="noopener noreferrer"
												className="text-[#FF8F6B] hover:underline break-all"
											>
												{task.link}
											</a>
										</div>
									)}
									{task.deadline && (
										<div className="flex items-center gap-2 text-gray-600">
											<span className="font-semibold">Deadline:</span>
											<span>{new Date(task.deadline).toLocaleString()}</span>
										</div>
									)}
								</div>
							))}
							
							{/* Task submission URL input */}
							<div className="flex flex-col gap-3 p-6 bg-white rounded-2xl shadow-md">
								<label className="text-lg font-semibold text-gray-900">
									Submit Your Work
								</label>
								<p className="text-sm text-gray-600 mb-2">
									Provide a link to your submission (e.g., GitHub repository, Google Drive, portfolio link)
								</p>
								<input
									type="url"
									value={taskSubmissionUrl}
									onChange={(e) => handleTaskUrlChange(e.target.value)}
									placeholder="https://github.com/username/repository"
									className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF8F6B] focus:outline-none text-gray-900"
								/>
								{lastSaved && (
									<p className="text-xs text-gray-500">
										Auto-saved at {lastSaved.toLocaleTimeString()}
									</p>
								)}
							</div>
						</>
					)}

					{/* Render questions from database */}
					{!isTaskRound && questions.length > 0 && (
						<>
							{questions.map((question) => (
								<SubjectiveQuestion
									key={question.id}
									id={question.id}
									prompt={question.text}
									placeholder="Enter your answer here..."
									helperText=""
									value={answers[question.id] || ''}
									onChange={(value) => handleAnswerChange(question.id, value)}
									isOptional={question.isOptional}
								/>
							))}
							{lastSaved && (
								<p className="text-xs text-gray-500 text-center">
									Auto-saved at {lastSaved.toLocaleTimeString()}
								</p>
							)}
						</>
					)}

					{/* Show message when no content available */}
					{!isTaskRound && questions.length === 0 && (
						<div className="text-center py-8">
							<p className="text-xl text-black/60">No questions available for this round yet.</p>
						</div>
					)}
					{isTaskRound && tasks.length === 0 && (
						<div className="text-center py-8">
							<p className="text-xl text-black/60">No tasks available for this round yet.</p>
						</div>
					)}						{error && (
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

			<AlertModal
				isOpen={alertModal.isOpen}
				title={alertModal.title}
				message={alertModal.message}
				onClose={() => setAlertModal({isOpen: false, title: "", message: ""})}
			/>
		</FormsShell>
	);
}
