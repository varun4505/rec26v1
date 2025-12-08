import LandingFooter from "./components/landing_footer";
import FormsDomainQuiz from "./forms_domain_quiz";
import FormsDomainSelection from "./forms_domain_selection";
import LandingProjects from "./landing_projects";

export default function Home() {
	return (
		<>
			<LandingProjects />
			{/* <FormsDomainSelection /> */}
			{/* <FormsDomainQuiz /> */}
			<LandingFooter />
		</>
	);
}