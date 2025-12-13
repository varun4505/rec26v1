"use client";

import { useState } from "react";
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
				type: "mixed",
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
				tasks: [
					{
						id: "web-dev-r1-t1",
						title: "Build a Full-Stack Web Application",
						description: "Create a complete web application with frontend and backend",
						instructions: [
							"Use a modern framework (React, Vue, Angular, Next.js)",
							"Implement authentication and database integration",
							"Deploy your application",
							"Submit GitHub repository and live demo link"
						],
						submissionType: "both",
						helperText: "Provide repository and deployed application URL"
					}
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
		"aiml": {
			"1": {
				type: "mixed",
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
				tasks: [
					{
						id: "ai-ml-r1-t1",
						title: "Build a Machine Learning Model",
						description: "Create and train a machine learning model on a real dataset",
						instructions: [
							"Choose a dataset (Kaggle, UCI, or custom)",
							"Perform data preprocessing and EDA",
							"Train and evaluate multiple models",
							"Submit your Jupyter notebook and results"
						],
						submissionType: "link",
						helperText: "Provide GitHub repository with notebook and documentation"
					}
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
		"competitive-coding": {
			"1": {
				type: "mixed",
				subjectiveQuestions: [
					{
						id: "cp-r1-q1",
						prompt: "Explain the difference between time and space complexity.",
						placeholder: "Type your explanation here...",
						helperText: "Include Big O notation and practical examples.",
					},
					{
						id: "cp-r1-q2",
						prompt: "What are dynamic programming and its key characteristics?",
						placeholder: "Describe dynamic programming...",
						helperText: "Include memoization, optimal substructure, and examples.",
					},
					{
						id: "cp-r1-q3",
						prompt: "Explain different sorting algorithms and their complexities.",
						placeholder: "Compare sorting algorithms...",
						helperText: "Include quicksort, mergesort, heapsort, etc.",
					},
				],
				tasks: [
					{
						id: "cp-r1-t1",
						title: "Solve Algorithmic Problems",
						description: "Solve coding problems on competitive programming platforms",
						instructions: [
							"Solve 5-10 medium to hard problems",
							"Platforms: LeetCode, CodeChef, Codeforces, HackerRank",
							"Include problem links and your solutions",
							"Explain your approach for complex problems"
						],
						submissionType: "link",
						helperText: "Share GitHub repository with solutions and explanations"
					}
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "cp-r2-prompt",
					prompt: "Submit your competitive coding profile",
					description: "Share your coding profile links and problem solutions.",
					variant: "repoStack",
				},
			},
		},
		"cyber-security": {
			"1": {
				type: "mixed",
				subjectiveQuestions: [
					{
						id: "cyber-r1-q1",
						prompt: "What are the different types of cyber attacks?",
						placeholder: "Type your answer here...",
						helperText: "Include phishing, DDoS, malware, SQL injection, etc.",
					},
					{
						id: "cyber-r1-q2",
						prompt: "Explain the CIA triad in cybersecurity.",
						placeholder: "Describe Confidentiality, Integrity, Availability...",
						helperText: "Include practical examples and importance.",
					},
					{
						id: "cyber-r1-q3",
						prompt: "What is encryption and how does it work?",
						placeholder: "Explain encryption mechanisms...",
						helperText: "Include symmetric vs asymmetric encryption.",
					},
				],
				tasks: [
					{
						id: "cyber-r1-t1",
						title: "Security Analysis or CTF Challenge",
						description: "Perform security analysis on a system or solve CTF challenges",
						instructions: [
							"Option 1: Analyze a website/app for vulnerabilities",
							"Option 2: Solve 3-5 CTF challenges (HackTheBox, TryHackMe)",
							"Document your findings and methodology",
							"Submit report with screenshots and explanations"
						],
						submissionType: "link",
						helperText: "Provide PDF report or GitHub repository with writeups"
					}
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "cyber-r2-prompt",
					prompt: "Submit your security project",
					description: "Share your security analysis, tools, or research documentation.",
					variant: "repoStack",
				},
			},
		},
	},
	design: {
		"ui-ux": {
			"1": {
				type: "mixed",
				subjectiveQuestions: [],
				tasks: [
					{
						id: "uiux-r1-t1",
						title: "Design for Chaos",
						description: "Imagine an app that's used in a panic — earthquake, protest, blackout. Design the interface that holds under confusion and fear. Why it works: stress-tests prioritization, clarity under pressure, and UX for emotion, not aesthetics.",
						instructions: [],
						submissionType: "link",
						helperText: ""
					},
					{
						id: "uiux-r1-t2",
						title: "Button Universe",
						description: "Create an app that has only one button. What does it do? How does the user understand its logic, feedback, and limits? Goal: distill complex interaction into a single intentional act. Why it's strong: tests clarity, micro-interaction design, and narrative design under extreme constraint.",
						instructions: [],
						submissionType: "link",
						helperText: ""
					}
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
		"graphics-design": {
			"1": {
				type: "mixed",
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
				tasks: [
					{
						id: "graphic-r1-t1",
						title: "Create a Brand Identity Package",
						description: "Design a complete brand identity for a company or product",
						instructions: [
							"Create logo variations and brand guidelines",
							"Design business cards and stationery",
							"Include color palette and typography system",
							"Submit portfolio link or PDF"
						],
						submissionType: "link",
						helperText: "Provide Behance/Dribbble link or Google Drive PDF"
					}
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
				type: "mixed",
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
				tasks: [
					{
						id: "motion-r1-t1",
						title: "Create a Motion Graphics Video",
						description: "Produce a 30-60 second motion graphics animation",
						instructions: [
							"Choose a concept (explainer, logo animation, title sequence)",
							"Create storyboard and animatic",
							"Add sound design and music",
							"Submit video link (YouTube, Vimeo, Drive)"
						],
						submissionType: "link",
						helperText: "Upload to YouTube/Vimeo or share Drive link"
					}
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
		"video-editing": {
			"1": {
				type: "mixed",
				subjectiveQuestions: [],
				tasks: [
					{
						id: "video-r1-t1",
						title: "Storytelling Reel (Shoot & Edit)",
						description: "Shoot and edit a short reel (under 60 seconds) that: Captures real footage shot by you, Tells a clear and meaningful story — for example, showing the energy and highlights of an event, a day in the club, or behind-the-scenes moments, Focuses on good pacing, smooth cuts, and emotional or energetic flow 🎬 Example: Make an aftermovie-style reel from the recent VinHack hackathon — show the crowd, coding sessions, judging, and final celebrations to tell the event's story in under a minute. (You can also choose any other story or theme you can shoot yourself — just make sure it has a beginning, middle, and end.)",
						instructions: [],
						submissionType: "link",
						helperText: ""
					},
					{
						id: "video-r1-t2",
						title: "Motion Graphics Product Video",
						description: "Create a short motion graphics product video (30-60 seconds) that: Showcases a tech product, feature, or concept (real or imaginary), Includes clean typography, smooth transitions, and appealing motion design, Maintains a professional and engaging visual flow 🍭 Example: Create a motion graphics promo video for VinnovateIT's \"Messit\" app — highlight its purpose, key features, and appeal through animation and transitions. (You can choose any product or concept, Messit is just an example.)",
						instructions: [],
						submissionType: "link",
						helperText: ""
					}
				],
			},
			"2": {
				type: "prompt",
				promptConfig: {
					id: "video-r2-prompt",
					prompt: "Submit your video editing work",
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
				type: "mixed",
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
				tasks: [
					{
						id: "event-r1-t1",
						title: "Plan a Complete Event",
						description: "Create a comprehensive event plan from concept to execution",
						instructions: [
							"Define event concept, objectives, and target audience",
							"Create detailed budget and timeline",
							"Develop marketing and promotion strategy",
							"Submit event plan document or presentation"
						],
						submissionType: "link",
						helperText: "Share Google Doc, PDF, or presentation link"
					}
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
				type: "mixed",
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
				tasks: [
					{
						id: "marketing-r1-t1",
						title: "Create a Marketing Campaign",
						description: "Develop a complete digital marketing campaign for a product/service",
						instructions: [
							"Define target audience and campaign objectives",
							"Create content strategy across multiple channels",
							"Design sample creatives and copy",
							"Submit campaign plan document"
						],
						submissionType: "link",
						helperText: "Share Google Doc, Canva, or PDF link"
					}
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
				type: "mixed",
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
				],				tasks: [
					{
						id: "content-r1-t1",
						title: "Write Content Pieces",
						description: "Create a portfolio of diverse content pieces",
						instructions: [
							"Write 3-5 different content pieces (blog, social, email, etc.)",
							"Demonstrate different writing styles and tones",
							"Include SEO optimization where applicable",
							"Submit portfolio link or document"
						],
						submissionType: "link",
						helperText: "Share Medium, Notion, Google Doc, or portfolio link"
					}
				],			},
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

	// State for task selection
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const [taskSubmissionLink, setTaskSubmissionLink] = useState("");

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
		console.log("Selected task:", selectedTaskId);
		console.log("Task submission:", taskSubmissionLink);
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
									Tasks - Choose Any One
								</h3>
								<p className="text-black/70 mb-6">
									<span className="font-semibold">Important:</span> Select and complete <span className="font-semibold underline">any ONE task</span> from the options below. You are not required to complete all tasks.
								</p>
								<div className="flex flex-col gap-4">
									{config.tasks.map((task, index) => (
										<div
											key={task.id}
											className={`rounded-[20px] p-6 border-2 transition-all cursor-pointer ${
												selectedTaskId === task.id
													? "bg-white border-orange-400 shadow-lg"
													: "bg-white/60 border-black/10 hover:border-orange-300"
											}`}
											onClick={() => setSelectedTaskId(task.id)}
										>
											<div className="flex items-start gap-4">
												<div className="flex-shrink-0">
													<input
														type="radio"
														name="task-selection"
														value={task.id}
														checked={selectedTaskId === task.id}
														onChange={() => setSelectedTaskId(task.id)}
														className="w-5 h-5 text-orange-500 focus:ring-orange-400"
													/>
												</div>
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
								
								{/* Submission field for selected task */}
								{selectedTaskId && (
									<div className="mt-6 rounded-[20px] bg-white p-6">
										<h4 className="text-lg font-semibold mb-4">Submit Your Work</h4>
										<p className="text-black/70 mb-4">
											Provide a link to your submission (e.g., GitHub repository, Google Drive, portfolio link)
										</p>
										<input
											type="url"
											value={taskSubmissionLink}
											onChange={(e) => setTaskSubmissionLink(e.target.value)}
											placeholder="https://..."
											className="w-full px-4 py-3 rounded-xl border border-black/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
										/>
									</div>
								)}
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
