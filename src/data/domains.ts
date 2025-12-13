export interface SubdomainItem {
  subdomain: string;
  domain: string;
  round: string;
  status: "Form Submitted" | "Rejected" | "Shortlisted" | "Interview Scheduled";
  rejectionMessage?: string;
  rejectionDetails?: string;
  showNextButton?: boolean;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
}

export const applications: SubdomainItem[] = [
  // Empty array for testing empty state
  // Or uncomment below for data:
  {
    subdomain: "Web Development",
    domain: "Tech Domain",
    round: "Round 1",
    status: "Shortlisted",
    showNextButton: true,
  },
  {
    subdomain: "Video Editing",
    domain: "Design Domain",
    round: "Round 1",
    status: "Rejected",
    rejectionMessage: "Hey, thanks for giving the recruitment your best shot.",
    rejectionDetails: "You didn't make it to the next round this time, but your effort didn't go unnoticed.\nKeep learning, keep building, and we'd love to see you apply again soon.",
    showNextButton: false,
  },
  {
    subdomain: "UI/UX Design",
    domain: "Design Domain",
    round: "Round 2",
    status: "Interview Scheduled",
    interviewDate: "25 October 2025",
    interviewTime: "3:00 PM",
    interviewLocation: "Room 301, Academic Block",
    showNextButton: true,
  },
];
