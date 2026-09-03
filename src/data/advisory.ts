export interface ServiceItem {
  id: string;
  title: string;
  headline: string;
  description: string;
  iconName: string;
}

export const ADVISORY_SERVICES: ServiceItem[] = [
  {
    id: 'investment',
    title: 'Investment Advisory',
    headline: 'Evaluate the opportunity before the property.',
    description: 'Data-backed capital deployment analysis, rental yield assessments, and macroeconomic horizon evaluations for high-net-worth investors.',
    iconName: 'TrendingUp',
  },
  {
    id: 'end-user',
    title: 'End-User Advisory',
    headline: 'Find the right home for your life and future.',
    description: 'Curated search and qualitative lifestyle matching focused on livability, developer track record, layouts, and community quality.',
    iconName: 'Home',
  },
  {
    id: 'deal',
    title: 'Deal Advisory',
    headline: 'Navigate pricing and negotiation with clarity.',
    description: 'Independent fair-value pricing benchmarks, contract transparency, due-diligence review, and strategic negotiation guidance.',
    iconName: 'Scale',
  },
  {
    id: 'portfolio',
    title: 'Portfolio Strategy',
    headline: 'Think beyond one property.',
    description: 'Holistic real estate portfolio diversification, capital reallocation, exit planning, and multi-asset wealth preservation.',
    iconName: 'Compass',
  },
];

export const VALUES = [
  {
    name: 'Integrity',
    description: 'Your interest always comes first. If a property is not right for you, we tell you directly.',
    iconName: 'ShieldCheck',
  },
  {
    name: 'Transparency',
    description: 'Clear facts and honest pricing. No hidden fees, no sales hype, and no bias.',
    iconName: 'Eye',
  },
  {
    name: 'Authenticity',
    description: 'Genuine advice based on solid research, verified builders, and legal title checks.',
    iconName: 'Sparkles',
  },
  {
    name: 'Relationships',
    description: 'We build lasting partnerships, helping you at every step long after the deal is done.',
    iconName: 'Users',
  },
];

export const STATS = [
  {
    number: 6,
    suffix: '+',
    label: 'Years Experience',
  },
  {
    number: 78,
    suffix: '+',
    label: 'Happy Clients',
  },
  {
    number: 1,
    suffix: 'M+',
    label: 'Sq. Ft. Sold',
  },
];
