import { Suspense } from "react";
import FormsDomainQuiz from "../forms_domain_quiz";

export default function QuizPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<FormsDomainQuiz />
		</Suspense>
	);
}
