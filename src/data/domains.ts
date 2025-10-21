export interface DomainItem {
  label: string;
  status: string;
}

export interface Domain {
  title: string;
  items: DomainItem[];
}

export const domains: Domain[] = [
  {
    title: "Tech",
    items: [
      { label: "Web Development", status: "Form Submitted" },
      { label: "App Development", status: "Form in progress" },
      { label: "Machine Learning", status: "Form Submitted" },
      { label: "Artificial Intelligence", status: "Form in progress" },
      { label: "Cybersecurity", status: "Form Submitted" },
      { label: "Cloud Computing", status: "Form in progress" },
      { label: "Data Science", status: "Form Submitted" },
    ],
  },
  {
    title: "Design",
    items: [
      { label: "UI/UX Design", status: "Form in progress" },
      { label: "Graphic Design", status: "Form Submitted" },
      { label: "Product Design", status: "Form in progress" },
      { label: "Motion Graphics", status: "Form Submitted" },
      { label: "Illustration", status: "Form in progress" },
      { label: "3D Modeling", status: "Form Submitted" },
      { label: "Brand Identity", status: "Form in progress" },
      { label: "Typography", status: "Form Submitted" },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Project Management", status: "Form Submitted" },
      { label: "Event Management", status: "Form in progress" },
      { label: "Marketing", status: "Form Submitted" },
      { label: "Public Relations", status: "Form in progress" },
      { label: "Operations", status: "Form Submitted" },
      { label: "Finance", status: "Form in progress" },
    ],
  },
];
