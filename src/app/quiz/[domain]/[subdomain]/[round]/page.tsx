"use client";

import { useParams } from "next/navigation";
import FormsShell from "../../../../components/FormsShell";
import {
	PromptQuestion,
	SubjectiveQuestion,
	type PromptVariant,
} from "../../../../components/question_types";

// Quiz configuration based on domain/subdomain/round
type QuizConfig = {
	type: "subjective" | "prompt";
	subjectiveQuestions?: Array<{
		id: string;
		prompt: string;
		placeholder?: string;
		helperText?: string;
	}>;
	promptConfig?: {
		id: string;
		prompt: string;
		description: string;
		variant: PromptVariant;
	};
};

// Configuration mapping for all quizzes
const quizConfigs: Record<
	string,
	Record<string, Record<string, QuizConfig>>
> = {
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

function formatSubdomainName(subdomain: string): string {
	return subdomain
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export default function QuizPage() {
	const params = useParams();
	const { domain, subdomain, round } = params;

	// Mock candidate data - in real app, this would come from auth/session
	const candidateData = {
		id: "24BCE2370",
		email: "aditya.madan2024a@vitstudent.ac.in",
	};

	// Get quiz configuration
	const config =
		quizConfigs[domain as string]?.[subdomain as string]?.[round as string];

	if (!config) {
		return (
			<FormsShell>
				<div className="flex items-center justify-center h-full">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
						<p className="text-gray-600">
							No quiz configured for {domain}/{subdomain}/round-{round}
						</p>
					</div>
				</div>
			</FormsShell>
		);
	}

	const handleSubmit = () => {
		console.log(`Submitting ${domain}/${subdomain}/round-${round}`);
		// Add submission logic here
	};

	return (
		<FormsShell>
			<div className="flex flex-col gap-10 p-8">
				<article className="flex flex-col gap-6 rounded-[32px] border border-white/20 bg-gradient-to-br from-[#FFF4EC] via-[#F7F5FF] to-[#EAF3FF] p-8 shadow-[0_25px_60px_rgba(15,15,15,0.25)]">
					<header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-3xl font-semibold sm:text-4xl">
								{formatSubdomainName(subdomain as string)}
							</h2>
							<p className="text-lg text-black/60 sm:text-xl">Round {round}</p>
						</div>
						<div className="text-right text-black/60">
							<p className="text-lg font-medium sm:text-xl">
								{candidateData.id}
							</p>
							<p className="text-sm sm:text-base">{candidateData.email}</p>
						</div>
					</header>
					<div className="flex flex-col gap-6 rounded-[28px] bg-[#F7B58D]/40 p-6">
						{/* Render subjective questions if provided */}
						{config.type === "subjective" &&
							config.subjectiveQuestions?.map((question) => (
								<SubjectiveQuestion
									key={question.id}
									id={question.id}
									prompt={question.prompt}
									placeholder={question.placeholder}
									helperText={question.helperText}
								/>
							))}

						{/* Render prompt question if provided */}
						{config.type === "prompt" && config.promptConfig && (
							<PromptQuestion
								id={config.promptConfig.id}
								prompt={config.promptConfig.prompt}
								description={config.promptConfig.description}
								variant={config.promptConfig.variant}
							/>
						)}

						<div className="flex justify-center pt-2">
							<button
								type="button"
								onClick={handleSubmit}
								className="rounded-full bg-gradient-to-r from-[#FFB37A] to-[#FF8F6B] px-8 py-2 text-base font-semibold text-white shadow-[0_10px_25px_rgba(255,143,107,0.35)]"
							>
								Submit
							</button>
						</div>
					</div>
				</article>
			</div>
		</FormsShell>
	);
}
