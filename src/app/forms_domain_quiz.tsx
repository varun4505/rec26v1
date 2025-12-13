"use client";

import { useSearchParams } from "next/navigation";
import FormsShell from "./components/FormsShell";
import {
	PromptQuestion,
	SubjectiveQuestion,
	type PromptVariant,
} from "./components/question_types";

// Quiz configuration based on domain/subdomain/round
type QuizConfig = {
	type: "subjective" | "prompt" | "mixed";
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
	tasks?: Array<{
		id: string;
		title: string;
		description: string;
		instructions: string[];
		submissionType: 'link' | 'document' | 'both';
		helperText?: string;
	}>;
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
					{
						id: "web-dev-r1-q3",
						prompt: "What are closures in JavaScript and how are they useful?",
						placeholder: "Explain closures with examples...",
						helperText: "Include practical use cases and examples.",
					},
					{
						id: "web-dev-r1-q4",
						prompt: "Explain the concept of responsive web design.",
						placeholder: "Describe responsive design principles...",
						helperText:
							"Include media queries, flexible layouts, and mobile-first approach.",
					},
					{
						id: "web-dev-r1-q5",
						prompt:
							"What is the difference between synchronous and asynchronous JavaScript?",
						placeholder: "Explain sync vs async programming...",
						helperText: "Include callbacks, promises, and async/await.",
					},
					{
						id: "web-dev-r1-q6",
						prompt: "Describe the MVC architecture pattern.",
						placeholder: "Explain Model-View-Controller...",
						helperText: "Include how it applies to web development.",
					},
					{
						id: "web-dev-r1-q7",
						prompt:
							"What are the benefits of using a CSS preprocessor like SASS?",
						placeholder: "List benefits of CSS preprocessors...",
						helperText:
							"Include variables, nesting, mixins, and other features.",
					},
					{
						id: "web-dev-r1-q8",
						prompt: "Explain the importance of web accessibility (a11y).",
						placeholder: "Describe web accessibility principles...",
						helperText: "Include WCAG guidelines and practical implementation.",
					},
					{
						id: "web-dev-r1-q9",
						prompt: "What is the purpose of version control systems like Git?",
						placeholder: "Explain version control benefits...",
						helperText:
							"Include branching, merging, and collaboration aspects.",
					},
					{
						id: "web-dev-r1-q10",
						prompt: "Describe the differences between HTTP and HTTPS.",
						placeholder: "Compare HTTP vs HTTPS...",
						helperText:
							"Include security, certificates, and performance considerations.",
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
				// Example of mixed type: both questions AND tasks together
				type: "mixed",
				subjectiveQuestions: [
					{
						id: "app-dev-r1-q1",
						prompt:
							"Compare React Native and Flutter for mobile app development.",
						placeholder: "Type your comparison here...",
						helperText:
							"Consider performance, development experience, and ecosystem.",
					},
					{
						id: "app-dev-r1-q2",
						prompt: "What are the key principles of mobile UI/UX design?",
						placeholder: "List mobile design principles...",
						helperText:
							"Include touch targets, navigation, and platform guidelines.",
					},
					{
						id: "app-dev-r1-q3",
						prompt:
							"Explain the difference between native and hybrid mobile apps.",
						placeholder: "Compare native vs hybrid apps...",
						helperText:
							"Include performance, development cost, and user experience.",
					},
					{
						id: "app-dev-r1-q4",
						prompt:
							"What is state management and why is it important in mobile apps?",
						placeholder: "Explain state management concepts...",
						helperText: "Include Redux, Context API, or similar solutions.",
					},
					{
						id: "app-dev-r1-q5",
						prompt: "How do you handle offline functionality in mobile apps?",
						placeholder: "Describe offline strategies...",
						helperText: "Include caching, local storage, and sync mechanisms.",
					},
				],
				// Multiple tasks - user must complete ANY ONE
				tasks: [
					{
						id: "app-dev-r1-t1",
						title: "Build a Cross-Platform Mobile App",
						description: "Create a mobile application using React Native or Flutter",
						instructions: [
							"Choose either React Native or Flutter framework",
							"Implement at least 3 core features",
							"Ensure responsive design for different screen sizes",
							"Add proper error handling and loading states",
							"Submit your GitHub repository and demo video"
						],
						submissionType: "both",
						helperText: "Provide repository link and live demo URL"
					},
					{
						id: "app-dev-r1-t2",
						title: "Create a Native iOS or Android App",
						description: "Build a native mobile app using Swift (iOS) or Kotlin (Android)",
						instructions: [
							"Use native development tools (Xcode or Android Studio)",
							"Implement proper architecture (MVVM/MVC)",
							"Include local data persistence",
							"Add animations and smooth transitions",
							"Submit project repository and APK/IPA file"
						],
						submissionType: "both",
						helperText: "Provide repository link and APK/demo link"
					},
					{
						id: "app-dev-r1-t3",
						title: "Develop a Progressive Web App (PWA)",
						description: "Create a mobile-first PWA with offline capabilities",
						instructions: [
							"Implement service workers for offline functionality",
							"Make it installable on mobile devices",
							"Optimize for mobile performance",
							"Add push notifications (optional)",
							"Deploy and submit the live URL"
						],
						submissionType: "link",
						helperText: "Provide the deployed PWA link and repository"
					}
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
					{
						id: "ai-ml-r1-q2",
						prompt: "What is overfitting and how can it be prevented?",
						placeholder: "Explain overfitting and prevention methods...",
						helperText:
							"Include regularization, cross-validation, and data augmentation.",
					},
					{
						id: "ai-ml-r1-q3",
						prompt:
							"Describe the difference between classification and regression.",
						placeholder: "Compare classification vs regression...",
						helperText: "Include examples and evaluation metrics for each.",
					},
					{
						id: "ai-ml-r1-q4",
						prompt: "What are neural networks and how do they work?",
						placeholder: "Explain neural network concepts...",
						helperText:
							"Include neurons, layers, activation functions, and backpropagation.",
					},
					{
						id: "ai-ml-r1-q5",
						prompt: "Explain the concept of feature engineering.",
						placeholder: "Describe feature engineering process...",
						helperText:
							"Include feature selection, scaling, and transformation.",
					},
					{
						id: "ai-ml-r1-q6",
						prompt: "What is the bias-variance tradeoff?",
						placeholder: "Explain bias-variance tradeoff...",
						helperText: "Include how it affects model performance.",
					},
					{
						id: "ai-ml-r1-q7",
						prompt: "Describe different types of machine learning algorithms.",
						placeholder: "List and explain ML algorithms...",
						helperText: "Include linear regression, decision trees, SVMs, etc.",
					},
					{
						id: "ai-ml-r1-q8",
						prompt:
							"What is deep learning and how does it differ from traditional ML?",
						placeholder: "Compare deep learning vs traditional ML...",
						helperText:
							"Include architectures, data requirements, and applications.",
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
				type: "prompt",
				promptConfig: {
					id: "ui-ux-r1-prompt",
					prompt: "Submit your UI/UX design work",
					description:
						"Share your Figma files, design documentation, and any additional resources for Round 1.",
					variant: "designAssets",
				},
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
					{
						id: "graphic-r1-q2",
						prompt: "What are the fundamental principles of design?",
						placeholder: "List and explain design principles...",
						helperText:
							"Include balance, contrast, emphasis, movement, pattern, rhythm, and unity.",
					},
					{
						id: "graphic-r1-q3",
						prompt: "Describe the color theory and its application in design.",
						placeholder: "Explain color theory concepts...",
						helperText:
							"Include color wheel, harmony, psychology, and accessibility.",
					},
					{
						id: "graphic-r1-q4",
						prompt:
							"What is the difference between raster and vector graphics?",
						placeholder: "Compare raster vs vector graphics...",
						helperText:
							"Include file formats, use cases, and editing software.",
					},
					{
						id: "graphic-r1-q5",
						prompt: "Explain the concept of visual hierarchy.",
						placeholder: "Describe visual hierarchy principles...",
						helperText: "Include size, color, contrast, and positioning.",
					},
					{
						id: "graphic-r1-q6",
						prompt: "What is branding and how does graphic design support it?",
						placeholder: "Explain branding in graphic design...",
						helperText:
							"Include brand identity, consistency, and brand guidelines.",
					},
					{
						id: "graphic-r1-q7",
						prompt: "Describe the print design workflow and considerations.",
						placeholder: "Explain print design process...",
						helperText:
							"Include CMYK, resolution, bleed, and print specifications.",
					},
					{
						id: "graphic-r1-q8",
						prompt:
							"What are the key differences between web and print design?",
						placeholder: "Compare web vs print design...",
						helperText:
							"Include color modes, resolution, and medium constraints.",
					},
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "graphic-r2-prompt",
					prompt: "Submit your graphic design portfolio",
					description: "Share your design files and portfolio documentation.",
					variant: "driveAssets",
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
					{
						id: "motion-r1-q2",
						prompt: "Explain the difference between 2D and 3D motion graphics.",
						placeholder: "Compare 2D vs 3D motion graphics...",
						helperText: "Include tools, techniques, and use cases for each.",
					},
					{
						id: "motion-r1-q3",
						prompt: "What is keyframe animation and how does it work?",
						placeholder: "Describe keyframe animation...",
						helperText: "Include timing, easing, and interpolation concepts.",
					},
					{
						id: "motion-r1-q4",
						prompt: "Describe the role of storytelling in motion graphics.",
						placeholder: "Explain storytelling in motion graphics...",
						helperText: "Include narrative structure and visual communication.",
					},
					{
						id: "motion-r1-q5",
						prompt:
							"What are the key considerations for motion graphics timing?",
						placeholder: "Discuss timing in motion graphics...",
						helperText: "Include pacing, rhythm, and audience attention.",
					},
					{
						id: "motion-r1-q6",
						prompt:
							"Explain the importance of sound design in motion graphics.",
						placeholder: "Describe sound design role...",
						helperText:
							"Include synchronization, mood, and audio-visual harmony.",
					},
					{
						id: "motion-r1-q7",
						prompt:
							"What are the different output formats for motion graphics?",
						placeholder: "List motion graphics formats...",
						helperText:
							"Include video codecs, resolution, and platform requirements.",
					},
					{
						id: "motion-r1-q8",
						prompt:
							"How do you optimize motion graphics for different platforms?",
						placeholder: "Describe platform optimization...",
						helperText:
							"Include social media, web, and broadcast considerations.",
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
					{
						id: "event-r1-q2",
						prompt: "What are the key phases of event planning?",
						placeholder: "Describe event planning phases...",
						helperText:
							"Include pre-event, event day, and post-event activities.",
					},
					{
						id: "event-r1-q3",
						prompt: "How do you create and manage an event budget?",
						placeholder: "Explain budget management process...",
						helperText:
							"Include cost estimation, tracking, and contingency planning.",
					},
					{
						id: "event-r1-q4",
						prompt: "What strategies do you use for vendor management?",
						placeholder: "Describe vendor management strategies...",
						helperText:
							"Include selection, contracts, and relationship management.",
					},
					{
						id: "event-r1-q5",
						prompt: "How do you ensure attendee safety and security at events?",
						placeholder: "Explain safety and security measures...",
						helperText:
							"Include risk assessment, emergency procedures, and crowd control.",
					},
					{
						id: "event-r1-q6",
						prompt:
							"What are effective event marketing and promotion strategies?",
						placeholder: "Describe marketing strategies...",
						helperText:
							"Include digital marketing, partnerships, and audience targeting.",
					},
					{
						id: "event-r1-q7",
						prompt: "How do you measure event success and ROI?",
						placeholder: "Explain success measurement methods...",
						helperText:
							"Include KPIs, feedback collection, and analysis techniques.",
					},
					{
						id: "event-r1-q8",
						prompt: "Describe your approach to managing event logistics.",
						placeholder: "Explain logistics management...",
						helperText:
							"Include venue setup, transportation, and coordination.",
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
					{
						id: "marketing-r1-q2",
						prompt: "What is the marketing mix (4 Ps) and how do you apply it?",
						placeholder: "Describe the marketing mix...",
						helperText:
							"Include Product, Price, Place, and Promotion strategies.",
					},
					{
						id: "marketing-r1-q3",
						prompt:
							"How do you create and execute a digital marketing campaign?",
						placeholder: "Explain digital campaign process...",
						helperText: "Include planning, channels, content, and measurement.",
					},
					{
						id: "marketing-r1-q4",
						prompt: "What is customer segmentation and why is it important?",
						placeholder: "Describe customer segmentation...",
						helperText:
							"Include demographic, psychographic, and behavioral segmentation.",
					},
					{
						id: "marketing-r1-q5",
						prompt: "How do you measure marketing campaign effectiveness?",
						placeholder: "Explain measurement methods...",
						helperText: "Include KPIs, analytics tools, and ROI calculation.",
					},
					{
						id: "marketing-r1-q6",
						prompt: "What is content marketing and how does it drive results?",
						placeholder: "Describe content marketing strategy...",
						helperText:
							"Include content types, distribution, and audience engagement.",
					},
					{
						id: "marketing-r1-q7",
						prompt: "Explain the customer journey and touchpoint optimization.",
						placeholder: "Describe customer journey mapping...",
						helperText:
							"Include awareness, consideration, purchase, and retention stages.",
					},
					{
						id: "marketing-r1-q8",
						prompt: "How do you leverage social media for brand building?",
						placeholder: "Explain social media strategy...",
						helperText:
							"Include platform selection, content strategy, and community management.",
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
					{
						id: "content-r1-q2",
						prompt:
							"What is SEO writing and how do you optimize content for search engines?",
						placeholder: "Explain SEO writing techniques...",
						helperText:
							"Include keyword research, on-page optimization, and readability.",
					},
					{
						id: "content-r1-q3",
						prompt:
							"Describe your process for researching and fact-checking content.",
						placeholder: "Explain research methodology...",
						helperText:
							"Include source verification, credibility assessment, and documentation.",
					},
					{
						id: "content-r1-q4",
						prompt: "How do you create compelling headlines and hooks?",
						placeholder: "Describe headline writing techniques...",
						helperText:
							"Include attention-grabbing strategies and A/B testing.",
					},
					{
						id: "content-r1-q5",
						prompt:
							"What are the key elements of storytelling in content writing?",
						placeholder: "Explain storytelling techniques...",
						helperText:
							"Include narrative structure, character development, and emotional connection.",
					},
					{
						id: "content-r1-q6",
						prompt:
							"How do you maintain consistency in brand voice across content?",
						placeholder: "Describe brand voice strategies...",
						helperText:
							"Include style guides, tone documentation, and team collaboration.",
					},
					{
						id: "content-r1-q7",
						prompt:
							"What strategies do you use for content repurposing and distribution?",
						placeholder: "Explain content repurposing methods...",
						helperText:
							"Include format adaptation and multi-channel distribution.",
					},
					{
						id: "content-r1-q8",
						prompt: "How do you measure content performance and engagement?",
						placeholder: "Describe content analytics...",
						helperText: "Include metrics, tools, and optimization strategies.",
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

export default function FormsDomainQuiz() {
	const searchParams = useSearchParams();
	const domain = searchParams.get("domain") || "tech";
	const subdomain = searchParams.get("subdomain") || "web-development";
	const round = searchParams.get("round") || "1";

	// Mock candidate data - in real app, this would come from auth/session
	const candidateData = {
		id: "24BCE2370",
		email: "aditya.madan2024a@vitstudent.ac.in",
	};

	// Get quiz configuration
	const config = quizConfigs[domain]?.[subdomain]?.[round];

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
								{formatSubdomainName(subdomain)}
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
					{/* Render subjective questions if provided */}
					{config.subjectiveQuestions && config.subjectiveQuestions.length > 0 && (
						<div className="flex flex-col gap-6">
							{config.subjectiveQuestions.map((question) => (
								<SubjectiveQuestion
									key={question.id}
									id={question.id}
									prompt={question.prompt}
									placeholder={question.placeholder}
									helperText={question.helperText}
								/>
							))}
						</div>
					)}

					{/* Render tasks if provided - user can choose any one */}
					{config.tasks && config.tasks.length > 0 && (
						<div className="flex flex-col gap-6">
							<div className="rounded-[28px] bg-[#F7B58D]/40 p-6">
								<h3 className="text-2xl font-semibold mb-4">
									Choose Any One Task
								</h3>
								<p className="text-black/70 mb-6">
									Select and complete one task from the options below:
								</p>
								<div className="flex flex-col gap-4">
									{config.tasks.map((task, index) => (
										<div
											key={task.id}
											className="rounded-[20px] bg-white/60 p-6 border border-black/10"
										>
											<div className="flex items-start gap-4">
												<div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold">
													{index + 1}
												</div>
												<div className="flex-1">
													<h4 className="text-xl font-semibold mb-2">
														{task.title}
													</h4>
													<p className="text-black/70 mb-4">
														{task.description}
													</p>
													{task.instructions && task.instructions.length > 0 && (
														<div className="mb-4">
															<p className="font-medium mb-2">Instructions:</p>
															<ul className="list-disc list-inside space-y-1 text-black/70">
																{task.instructions.map((instruction, idx) => (
																	<li key={idx}>{instruction}</li>
																))}
															</ul>
														</div>
													)}
													{task.helperText && (
														<p className="text-sm text-black/60 italic">
															{task.helperText}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Render prompt question if provided */}
					{config.type === "prompt" && config.promptConfig && (
						<div className="flex flex-col gap-6 rounded-[28px] bg-[#F7B58D]/40 p-6">
							<PromptQuestion
								id={config.promptConfig.id}
								prompt={config.promptConfig.prompt}
								description={config.promptConfig.description}
								variant={config.promptConfig.variant}
							/>
						</div>
					)}

					{/* Submit button */}
					<div className="flex justify-center pt-2">
						<button
							type="button"
							onClick={handleSubmit}
							className="rounded-4xl bg-[#FFFFFF80] text-lg px-12 py-3 shadow-[3px_0px_11.9px_2px_rgba(248,104,0,0.3)]"
						>
							Submit Form
						</button>
					</div>
				</article>
			</div>
		</FormsShell>
	);
}
