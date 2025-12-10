"use client";

import React from "react";

interface SubjectiveQuestionProps {
	id: string;
	prompt: string;
	placeholder?: string;
	helperText?: string;
	onChange?: (value: string) => void;
	value?: string;
}

export function SubjectiveQuestion({
	id,
	prompt,
	placeholder,
	helperText,
	onChange,
	value,
}: SubjectiveQuestionProps) {
	return (
		<section className="flex flex-col gap-3 rounded-[28px] bg-[#F7B58D]/40 p-6">
			<label htmlFor={id} className="text-xl font-semibold">
				{prompt}
			</label>
			<textarea
				id={id}
				name={id}
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				placeholder={placeholder ?? "Type your response here..."}
				className="min-h-[120px] w-full rounded-2xl bg-[#F8680029] px-4 py-3 text-base outline-none focus:border-amber-500"
			/>
			{helperText && <p className="text-sm text-neutral-500">{helperText}</p>}
		</section>
	);
}

type PromptVariant = "repoStack" | "driveAssets" | "designAssets";

interface PromptFieldConfig {
	name: string;
	label: string;
	placeholder?: string;
}

// Map prompt variants to the input fields they should display.
const promptVariantFields: Record<PromptVariant, PromptFieldConfig[]> = {
	repoStack: [
		{
			name: "githubLink",
			label: "GitHub Link",
			placeholder: "https://github.com/username/project",
		},
		{
			name: "deploymentLink",
			label: "Deployment Link",
			placeholder: "https://your-app.com",
		},
		{
			name: "otherLink",
			label: "Any Other Link",
			placeholder: "Share any additional resource",
		},
	],
	driveAssets: [
		{
			name: "googleDriveLink",
			label: "Google Drive Link",
			placeholder: "https://drive.google.com/...",
		},
		{
			name: "otherLink",
			label: "Any Other Link",
			placeholder: "Share any additional resource",
		},
	],
	designAssets: [
		{
			name: "figmaLink",
			label: "Figma File Link",
			placeholder: "https://www.figma.com/file/...",
		},
		{
			name: "googleDriveLink",
			label: "Google Drive Link",
			placeholder: "https://drive.google.com/...",
		},
		{
			name: "otherLink",
			label: "Any Other Link",
			placeholder: "Share any additional resource",
		},
	],
};

interface PromptQuestionProps {
	id: string;
	prompt: string;
	variant: PromptVariant;
	description?: string;
	helperText?: string;
}

export function PromptQuestion({
	id,
	prompt,
	variant,
	description,
	helperText,
}: PromptQuestionProps) {
	const fields = promptVariantFields[variant];

	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h3 className="text-xl font-semibold">{prompt}</h3>
				{description && (
					<p className="text-sm text-neutral-500">{description}</p>
				)}
			</div>
			<div className="flex flex-col gap-3">
				{fields.map((field) => (
					<label key={field.name} className="flex flex-col gap-2 text-base">
						<span className="font-medium">{field.label}</span>
						<input
							type="url"
							name={`${id}-${field.name}`}
							id={`${id}-${field.name}`}
							placeholder={field.placeholder}
							className="w-full rounded-2xl bg-[#F8680029] px-4 py-3 outline-none focus:border-amber-500"
						/>
					</label>
				))}
			</div>
			{helperText && <p className="text-sm text-neutral-500">{helperText}</p>}
		</section>
	);
}

export type { PromptVariant };
