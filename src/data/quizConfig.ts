// Quiz configuration for all domains, subdomains, and rounds

export type QuestionType = 'subjective' | 'mcq' | 'task-submission';

export interface SubjectiveQuestion {
  id: string;
  prompt: string;
  placeholder?: string;
  helperText?: string;
}

export interface MCQQuestion {
  id: string;
  prompt: string;
  options: string[];
  helperText?: string;
}

export interface TaskSubmission {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  submissionType: 'link' | 'document' | 'both';
  helperText?: string;
}

export interface QuizConfig {
  type: 'questionnaire' | 'task';
  questions?: (SubjectiveQuestion | MCQQuestion)[];
  tasks?: TaskSubmission[];
}

type DomainQuizConfig = {
  [subdomain: string]: {
    [round: string]: QuizConfig;
  };
};

export const QUIZ_CONFIGS: Record<string, DomainQuizConfig> = {
  // TECHNICAL DOMAIN
  tech: {
    'web-development': {
      '1': {
        type: 'questionnaire',
        questions: [
          {
            id: 'web-dev-r1-q1',
            prompt: 'Explain the difference between var, let, and const in JavaScript.',
            placeholder: 'Type your explanation here...',
            helperText: 'Consider scope, hoisting, and reassignment behavior.',
          },
          {
            id: 'web-dev-r1-q2',
            prompt: 'What is the virtual DOM and how does it improve performance?',
            placeholder: 'Type your answer here...',
            helperText: 'Explain the concept and its benefits.',
          },
          {
            id: 'web-dev-r1-q3',
            prompt: 'Describe your experience with responsive web design.',
            placeholder: 'Share your experience...',
            helperText: 'Include frameworks, techniques, and projects.',
          },
        ],
      },
      '2': {
        type: 'task',
        tasks: [
          {
            id: 'web-dev-r2-t1',
            title: 'Build a Full-Stack Web Application',
            description: 'Create a complete web application with frontend and backend',
            instructions: [
              'Use any modern framework (React, Vue, Angular, etc.)',
              'Implement authentication and authorization',
              'Connect to a database',
              'Deploy your application',
              'Submit your GitHub repository and live demo link',
            ],
            submissionType: 'link',
            helperText: 'Provide links to your repository and deployed application',
          },
          {
            id: 'web-dev-r2-t2',
            title: 'Create an Interactive Dashboard',
            description: 'Build a data visualization dashboard',
            instructions: [
              'Fetch data from an API',
              'Create interactive charts and graphs',
              'Implement filtering and sorting',
              'Ensure responsive design',
              'Submit your project repository and demo',
            ],
            submissionType: 'link',
          },
        ],
      },
    },
    'app-development': {
      '1': {
        type: 'questionnaire',
        questions: [
          {
            id: 'app-dev-r1-q1',
            prompt: 'Compare React Native and Flutter for mobile app development.',
            placeholder: 'Type your comparison here...',
            helperText: 'Consider performance, development experience, and ecosystem.',
          },
          {
            id: 'app-dev-r1-q2',
            prompt: 'Explain the concept of state management in mobile apps.',
            placeholder: 'Type your explanation...',
            helperText: 'Include examples from frameworks you have used.',
          },
        ],
      },
      '2': {
        type: 'task',
        tasks: [
          {
            id: 'app-dev-r2-t1',
            title: 'Build a Mobile Application',
            description: 'Create a fully functional mobile app',
            instructions: [
              'Choose React Native, Flutter, or native development',
              'Implement core features and navigation',
              'Add offline support',
              'Test on multiple devices',
              'Submit repository and APK/IPA or app store link',
            ],
            submissionType: 'both',
          },
        ],
      },
    },
    'aiml': {
      '1': {
        type: 'questionnaire',
        questions: [
          {
            id: 'aiml-r1-q1',
            prompt: 'Explain the difference between supervised and unsupervised learning.',
            placeholder: 'Type your explanation here...',
            helperText: 'Include examples and use cases for each.',
          },
          {
            id: 'aiml-r1-q2',
            prompt: 'What is overfitting and how can you prevent it?',
            placeholder: 'Type your answer...',
            helperText: 'Discuss techniques like regularization and cross-validation.',
          },
        ],
      },
      '2': {
        type: 'task',
        tasks: [
          {
            id: 'aiml-r2-t1',
            title: 'Machine Learning Project',
            description: 'Build and deploy a machine learning model',
            instructions: [
              'Choose a dataset and problem statement',
              'Perform data preprocessing and EDA',
              'Train and evaluate your model',
              'Deploy your model (Streamlit, Flask, FastAPI)',
              'Submit repository with documentation',
            ],
            submissionType: 'link',
          },
        ],
      },
    },
    'competitive-coding': {
      '1': {
        type: 'questionnaire',
        questions: [
          {
            id: 'cp-r1-q1',
            prompt: 'Explain your approach to solving a dynamic programming problem.',
            placeholder: 'Describe your methodology...',
            helperText: 'Include how you identify DP problems and optimize solutions.',
          },
          {
            id: 'cp-r1-q2',
            prompt: 'What is your coding platform rating and notable achievements?',
            placeholder: 'Share your competitive coding profile...',
            helperText: 'Include links to Codeforces, LeetCode, CodeChef, etc.',
          },
        ],
      },
      '2': {
        type: 'task',
        tasks: [
          {
            id: 'cp-r2-t1',
            title: 'Competitive Coding Challenge',
            description: 'Solve advanced algorithmic problems',
            instructions: [
              'Submit solutions to 5 medium-hard problems',
              'Provide well-commented code',
              'Include time and space complexity analysis',
              'Submit via GitHub repository',
            ],
            submissionType: 'link',
          },
        ],
      },
    },
    'cyber-security': {
      '1': {
        type: 'questionnaire',
        questions: [
          {
            id: 'cyber-r1-q1',
            prompt: 'Explain the OWASP Top 10 vulnerabilities.',
            placeholder: 'List and explain...',
            helperText: 'Focus on web application security.',
          },
          {
            id: 'cyber-r1-q2',
            prompt: 'Describe your experience with penetration testing or CTF challenges.',
            placeholder: 'Share your experience...',
            helperText: 'Include tools and methodologies you are familiar with.',
          },
        ],
      },
      '2': {
        type: 'task',
        tasks: [
          {
            id: 'cyber-r2-t1',
            title: 'Security Assessment Project',
            description: 'Perform security analysis on a system or application',
            instructions: [
              'Choose a target (with permission) or use practice platforms',
              'Document vulnerabilities found',
              'Provide detailed report with remediation steps',
              'Submit report as PDF document',
            ],
            submissionType: 'document',
          },
        ],
      },
    },
  },

  // MANAGEMENT DOMAIN
  management: {
    '': { // No subdomain for management
      '1': {
        type: 'questionnaire',
        questions: [
          {
            id: 'mgmt-r1-q1',
            prompt: 'Describe a challenging event or project you managed. What was your approach?',
            placeholder: 'Share your experience...',
            helperText: 'Include the problem, your solution, and outcomes.',
          },
          {
            id: 'mgmt-r1-q2',
            prompt: 'How do you handle conflicts within a team?',
            placeholder: 'Explain your conflict resolution strategy...',
            helperText: 'Provide specific examples if possible.',
          },
          {
            id: 'mgmt-r1-q3',
            prompt: 'What marketing strategies would you use to promote a college technical fest?',
            placeholder: 'Outline your marketing plan...',
            helperText: 'Consider social media, partnerships, and traditional methods.',
          },
          {
            id: 'mgmt-r1-q4',
            prompt: 'Explain your experience with budget management and resource allocation.',
            placeholder: 'Describe your approach...',
            helperText: 'Include examples from past projects or events.',
          },
        ],
      },
    },
  },

  // DESIGN DOMAIN
  design: {
    'ui-ux': {
      '1': {
        type: 'task',
        tasks: [
          {
            id: 'uiux-r1-t1',
            title: 'UI/UX Design Project',
            description: 'Create a complete design for a mobile or web application',
            instructions: [
              'Choose an app idea or redesign an existing app',
              'Create user personas and user flows',
              'Design wireframes and high-fidelity mockups',
              'Ensure responsive design principles',
              'Submit Figma/Adobe XD link with viewing access',
            ],
            submissionType: 'link',
            helperText: 'Make sure your Figma file is publicly accessible',
          },
          {
            id: 'uiux-r1-t2',
            title: 'Design System Creation',
            description: 'Build a comprehensive design system',
            instructions: [
              'Create a color palette and typography system',
              'Design reusable components',
              'Document design guidelines',
              'Submit complete design system file',
            ],
            submissionType: 'link',
          },
        ],
      },
    },
    'graphics-design': {
      '1': {
        type: 'task',
        tasks: [
          {
            id: 'graphics-r1-t1',
            title: 'Branding and Visual Identity',
            description: 'Create a complete brand identity package',
            instructions: [
              'Design logo and brand guidelines',
              'Create social media graphics',
              'Design marketing materials (posters, flyers)',
              'Ensure cohesive visual language',
              'Submit portfolio as PDF or online link',
            ],
            submissionType: 'both',
            helperText: 'You can use Behance, Dribbble, or Google Drive',
          },
          {
            id: 'graphics-r1-t2',
            title: 'Illustration Series',
            description: 'Create a themed illustration series',
            instructions: [
              'Choose a theme or story',
              'Create 5-7 related illustrations',
              'Show variety in style and composition',
              'Submit high-resolution files',
            ],
            submissionType: 'both',
          },
        ],
      },
    },
    'video-editing': {
      '1': {
        type: 'task',
        tasks: [
          {
            id: 'video-r1-t1',
            title: 'Video Production Project',
            description: 'Create and edit a professional video',
            instructions: [
              'Choose a topic (promotional, educational, creative)',
              'Shoot or source footage',
              'Edit with transitions, effects, and sound design',
              'Export in high quality (1080p minimum)',
              'Upload to YouTube/Vimeo and submit link',
            ],
            submissionType: 'link',
            helperText: 'Make sure your video is publicly accessible',
          },
          {
            id: 'video-r1-t2',
            title: 'Motion Graphics Showcase',
            description: 'Create an animated motion graphics piece',
            instructions: [
              'Design animated explainer or title sequence',
              'Use After Effects or similar tools',
              'Include sound design',
              'Duration: 30-60 seconds',
              'Submit video link',
            ],
            submissionType: 'link',
          },
        ],
      },
    },
  },
};

export function getQuizConfig(
  domain: string,
  subdomain: string | null,
  round: string
): QuizConfig | null {
  const domainConfig = QUIZ_CONFIGS[domain];
  if (!domainConfig) return null;

  const subdomainKey = subdomain || '';
  const subdomainConfig = domainConfig[subdomainKey];
  if (!subdomainConfig) return null;

  return subdomainConfig[round] || null;
}
