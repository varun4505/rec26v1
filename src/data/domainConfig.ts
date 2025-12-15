// Domain configuration for recruitment system

export type DomainType = 'technical' | 'management' | 'design';
export type RoundType = 'round1' | 'round2';

export interface SubdomainInfo {
  id: string;
  name: string;
  slug: string;
  rounds?: RoundInfo[];
}

export interface RoundInfo {
  id: RoundType;
  name: string;
  type: 'questionnaire' | 'task' | 'combined';
  description: string;
}

export interface DomainConfig {
  id: DomainType;
  name: string;
  slug: string;
  hasSubdomains: boolean;
  subdomains: SubdomainInfo[];
  rounds: RoundInfo[];
}

export const DOMAIN_CONFIG: Record<DomainType, DomainConfig> = {
  technical: {
    id: 'technical',
    name: 'Technical',
    slug: 'tech',
    hasSubdomains: true,
    subdomains: [
      { id: 'web-dev', name: 'Web Development', slug: 'web-development' },
      { id: 'app-dev', name: 'App Development', slug: 'app-development' },
      { id: 'aiml', name: 'AI/ML', slug: 'aiml' },
      { 
        id: 'cp', 
        name: 'Competitive Coding', 
        slug: 'competitive-coding',
        rounds: [
          {
            id: 'round1',
            name: 'Round 1',
            type: 'combined',
            description: 'Solve coding problems and submit your approach',
          }
        ]
      },
      { 
        id: 'cyber', 
        name: 'Cyber Security', 
        slug: 'cyber-security',
        rounds: [
          {
            id: 'round1',
            name: 'Round 1',
            type: 'combined',
            description: 'Complete the CTF challenges and submit flags',
          }
        ]
      },
    ],
    rounds: [
      {
        id: 'round1',
        name: 'Round 1',
        type: 'questionnaire',
        description: 'Technical questionnaire to assess your knowledge',
      },
      {
        id: 'round2',
        name: 'Round 2',
        type: 'task',
        description: 'Choose and submit one technical task',
      },
    ],
  },
  management: {
    id: 'management',
    name: 'Management',
    slug: 'management',
    hasSubdomains: false,
    subdomains: [],
    rounds: [
      {
        id: 'round1',
        name: 'Round 1',
        type: 'combined',
        description: 'Submit your management task and answer questions',
      },
    ],
  },
  design: {
    id: 'design',
    name: 'Design',
    slug: 'design',
    hasSubdomains: true,
    subdomains: [
      { id: 'uiux', name: 'UI/UX', slug: 'ui-ux' },
      { id: 'graphics', name: 'Graphic Design', slug: 'graphics-design' },
      { id: 'video', name: 'Video Editing', slug: 'video-editing' },
    ],
    rounds: [
      {
        id: 'round1',
        name: 'Round 1',
        type: 'combined',
        description: 'Submit your design task and answer questions',
      },
    ],
  },
};

// Helper functions
export function getDomainConfig(domain: DomainType): DomainConfig | undefined {
  return DOMAIN_CONFIG[domain];
}

export function getSubdomainInfo(domain: DomainType, subdomainSlug: string): SubdomainInfo | undefined {
  const config = DOMAIN_CONFIG[domain];
  return config?.subdomains.find(s => s.slug === subdomainSlug);
}

export function getRoundInfo(domain: DomainType, round: RoundType, subdomain?: string | null): RoundInfo | undefined {
  const config = DOMAIN_CONFIG[domain];
  if (!config) return undefined;

  if (subdomain && config.hasSubdomains) {
    const subConfig = config.subdomains.find(s => s.slug === subdomain);
    if (subConfig?.rounds) {
      return subConfig.rounds.find(r => r.id === round);
    }
  }

  return config.rounds.find(r => r.id === round);
}

export function validateDomainSubmission(
  domain: DomainType,
  subdomain: string | null,
  round: RoundType
): { valid: boolean; error?: string } {
  const config = DOMAIN_CONFIG[domain];

  if (!config) {
    return { valid: false, error: 'Invalid domain' };
  }

  // Normalize subdomain: treat 'none' or 'general' as null
  const effectiveSubdomain = (subdomain === 'none' || subdomain === 'general') ? null : subdomain;

  // Check if domain requires subdomain
  if (config.hasSubdomains && !effectiveSubdomain) {
    return { valid: false, error: 'Subdomain is required for this domain' };
  }

  if (!config.hasSubdomains && effectiveSubdomain) {
    return { valid: false, error: 'This domain does not have subdomains' };
  }

  // Validate subdomain exists
  let rounds = config.rounds;
  if (effectiveSubdomain && config.hasSubdomains) {
    const subConfig = config.subdomains.find(s => s.slug === effectiveSubdomain);
    if (!subConfig) {
      return { valid: false, error: 'Invalid subdomain' };
    }
    if (subConfig.rounds) {
      rounds = subConfig.rounds;
    }
  }

  // Validate round exists for this domain/subdomain
  const roundExists = rounds.some(r => r.id === round);
  if (!roundExists) {
    // Special handling for legacy/missing config
    return { valid: false, error: 'Invalid round for this domain' };
  }

  return { valid: true };
}
