// Domain configuration for recruitment system

export type DomainType = 'technical' | 'management' | 'design';
export type RoundType = 'round1' | 'round2';

export interface SubdomainInfo {
  id: string;
  name: string;
  slug: string;
}

export interface RoundInfo {
  id: RoundType;
  name: string;
  type: 'questionnaire' | 'task';
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
      { id: 'cp', name: 'Competitive Coding', slug: 'competitive-coding' },
      { id: 'cyber', name: 'Cyber Security', slug: 'cyber-security' },
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
    hasSubdomains: true,
    subdomains: [
      { id: 'event', name: 'Event Management', slug: 'event-management' },
      { id: 'marketing', name: 'Marketing', slug: 'marketing' },
      { id: 'content', name: 'Content Writing', slug: 'content-writing' },
    ],
    rounds: [
      {
        id: 'round1',
        name: 'Round 1',
        type: 'questionnaire',
        description: 'Management questionnaire to assess your skills',
      },
      {
        id: 'round2',
        name: 'Round 2',
        type: 'task',
        description: 'Submit your management task',
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
      { id: 'graphics', name: 'Graphics Design', slug: 'graphics-design' },
      { id: 'video', name: 'Video Editing', slug: 'video-editing' },
    ],
    rounds: [
      {
        id: 'round1',
        name: 'Round 1',
        type: 'task',
        description: 'Submit your design task',
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

export function getRoundInfo(domain: DomainType, round: RoundType): RoundInfo | undefined {
  const config = DOMAIN_CONFIG[domain];
  return config?.rounds.find(r => r.id === round);
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

  // Check if domain requires subdomain
  if (config.hasSubdomains && !subdomain) {
    return { valid: false, error: 'Subdomain is required for this domain' };
  }

  if (!config.hasSubdomains && subdomain) {
    return { valid: false, error: 'This domain does not have subdomains' };
  }

  // Validate subdomain exists
  if (subdomain && config.hasSubdomains) {
    const subdomainExists = config.subdomains.some(s => s.slug === subdomain);
    if (!subdomainExists) {
      return { valid: false, error: 'Invalid subdomain' };
    }
  }

  // Validate round exists for this domain
  const roundExists = config.rounds.some(r => r.id === round);
  if (!roundExists) {
    return { valid: false, error: 'Invalid round for this domain' };
  }

  return { valid: true };
}
