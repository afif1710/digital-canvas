export interface Project {
  id: string;
  title: string;
  role: string;
  challenge: string;
  solution: string;
  outcomes: string;
  kpis: { label: string; value: string }[];
  heroImage: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'project-01',
    title: 'Meridian Rebrand',
    role: 'Lead Designer & Art Director',
    challenge: 'A luxury watchmaker needed to attract younger audiences while preserving heritage appeal.',
    solution: 'Developed a visual identity bridging classic craftsmanship with contemporary minimalism.',
    outcomes: '40% increase in brand awareness among 25–35 year-olds, 28% uplift in DTC sales.',
    kpis: [{ label: 'Brand Awareness', value: '+40%' }, { label: 'DTC Sales', value: '+28%' }],
    heroImage: '/sample-data/projects/project-01/hero.jpg',
  },
  {
    id: 'project-02',
    title: 'Lumina Architecture',
    role: 'Visual Identity Designer',
    challenge: 'An award-winning architecture firm lacked a digital presence matching their built work.',
    solution: 'Created a structure-driven brand system inspired by blueprints and spatial thinking.',
    outcomes: 'Website traffic doubled; inbound inquiries rose 35% within three months.',
    kpis: [{ label: 'Web Traffic', value: '+100%' }, { label: 'Inquiries', value: '+35%' }],
    heroImage: '/sample-data/projects/project-02/hero.jpg',
  },
  {
    id: 'project-03',
    title: 'Verdant Botanicals',
    role: 'Brand Strategist & Designer',
    challenge: 'A sustainable skincare brand needed packaging that communicated eco-values without sacrificing luxury.',
    solution: 'Designed organic-inspired packaging with tactile finishes and a living-green palette.',
    outcomes: 'Retail sell-through rate increased 52%, earning two packaging design awards.',
    kpis: [{ label: 'Sell-Through', value: '+52%' }, { label: 'Awards', value: '2' }],
    heroImage: '/sample-data/projects/project-03/hero.jpg',
  },
  {
    id: 'project-04',
    title: 'Obsidian Watches',
    role: 'Creative Director',
    challenge: 'A heritage watchmaker sought a bold digital campaign for their darkest collection yet.',
    solution: 'Produced a cinematic micro-site with dark themes, 3D product renders, and immersive scrollytelling.',
    outcomes: 'Collection sold out in 72 hours; site won an Awwwards SOTD.',
    kpis: [{ label: 'Sell-Out', value: '72h' }, { label: 'Recognition', value: 'SOTD' }],
    heroImage: '/sample-data/projects/project-04/hero.jpg',
  },
  {
    id: 'project-05',
    title: 'Aurora Dance Co.',
    role: 'Visual Director',
    challenge: 'A contemporary dance company needed a brand that captured movement and emotion in static media.',
    solution: 'Built a fluid identity system with motion-blur photography and kinetic typography.',
    outcomes: 'Season ticket sales grew 30% and social media following tripled.',
    kpis: [{ label: 'Ticket Sales', value: '+30%' }, { label: 'Social Growth', value: '3×' }],
    heroImage: '/sample-data/projects/project-05/hero.jpg',
  },
  {
    id: 'project-06',
    title: 'Helix Biotech',
    role: 'UI/UX Lead',
    challenge: 'A biotech startup needed a dashboard that made complex genomic data accessible to clinicians.',
    solution: 'Designed an intuitive data-visualization platform with progressive disclosure and guided workflows.',
    outcomes: 'User onboarding time cut by 60%; NPS rose from 32 to 71.',
    kpis: [{ label: 'Onboarding', value: '−60%' }, { label: 'NPS', value: '71' }],
    heroImage: '/sample-data/projects/project-06/hero.jpg',
  },
  {
    id: 'project-07',
    title: 'Solstice Wine',
    role: 'Brand Designer',
    challenge: 'A family vineyard wanted a premium label system that told the story of each harvest.',
    solution: 'Created hand-illustrated labels with seasonal color palettes and artisan typography.',
    outcomes: 'Premium line revenue increased 45%; brand featured in Wine Spectator.',
    kpis: [{ label: 'Revenue', value: '+45%' }, { label: 'Press', value: 'Wine Spec.' }],
    heroImage: '/sample-data/projects/project-07/hero.jpg',
  },
  {
    id: 'project-08',
    title: 'Volta Electric',
    role: 'Design Systems Lead',
    challenge: 'An EV startup needed a scalable design system across web, mobile, and in-car interfaces.',
    solution: 'Developed a token-based component library with adaptive theming for light, dark, and ambient modes.',
    outcomes: 'Design-to-dev handoff time reduced 70%; consistent UI across 12 product surfaces.',
    kpis: [{ label: 'Handoff Time', value: '−70%' }, { label: 'Surfaces', value: '12' }],
    heroImage: '/sample-data/projects/project-08/hero.jpg',
  },
];

export const ALCOVE_SPACING = 6;
export const ALCOVE_Z_START = -10;
export const CORRIDOR_START_Z = 2;
export const CORRIDOR_END_Z = -58;
export const CAMERA_Y = 2.2;

export function getAlcovePosition(index: number): {
  position: [number, number, number];
  rotation: [number, number, number];
  z: number;
} {
  const z = ALCOVE_Z_START - index * ALCOVE_SPACING;
  const isRight = index % 2 === 0;
  return {
    position: [isRight ? 3.3 : -3.3, 1.8, z],
    rotation: [0, isRight ? -Math.PI / 2 : Math.PI / 2, 0],
    z,
  };
}

export function getAlcoveProgress(index: number): number {
  const z = ALCOVE_Z_START - index * ALCOVE_SPACING;
  return (CORRIDOR_START_Z - z) / (CORRIDOR_START_Z - CORRIDOR_END_Z);
}
