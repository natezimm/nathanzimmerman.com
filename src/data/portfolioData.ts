import blackjackImgWebp from '@/assets/project-blackjack.webp';
import brickbreakerDetailImgWebp from '@/assets/project-brickbreaker-detail.webp';
import brickbreakerImgWebp from '@/assets/project-brickbreaker.webp';
import nerdleImgWebp from '@/assets/project-nerdle.webp';
import sudokuImgWebp from '@/assets/project-sudoku.webp';

export type ViewMode = 'map' | 'grid';
export type SectionId =
  | 'about'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'contact';

export type ProjectEntry = {
  slug: string;
  title: string;
  subtitle: string;
  regionLabel: string;
  summary: string;
  description: string;
  stack: string[];
  features: string[];
  links: {
    live?: string;
    code?: string;
  };
  image: string;
  detailImage?: string;
  mediaBackground: 'light' | 'dark';
  accent: 'forest' | 'violet' | 'ember' | 'azure' | 'gold' | 'jade';
};

export const projectEntries: ProjectEntry[] = [
  {
    slug: 'brick-breaker',
    title: 'BRICK BREAKER',
    subtitle: 'Brick Breaker Resume',
    regionLabel: 'Arcade District',
    summary:
      'Browser-based Phaser.js game that turns a .docx resume into a playable Brick Breaker level.',
    description:
      'Resume text is parsed into interactive bricks, combining classic arcade gameplay with a gamified take on a resume.',
    stack: ['JavaScript', 'Phaser.js', 'Mammoth.js'],
    features: [
      'Parses .docx resume content into playable brick layouts',
      'Classic paddle, scoring, lives, and quick replay loops',
      'Responsive game board and keyboard controls',
      'Portfolio-focused deployment with a readable game loop',
    ],
    links: {
      live: 'https://resume.nathanzimmerman.com',
      code: 'https://github.com/natezimm/brick-breaker-resume',
    },
    image: brickbreakerImgWebp,
    detailImage: brickbreakerDetailImgWebp,
    mediaBackground: 'light',
    accent: 'forest',
  },
  {
    slug: 'nerdle',
    title: 'NERDLE',
    subtitle: 'Daily Numbers Puzzle',
    regionLabel: 'Letter Wizard Tower',
    summary:
      'Word puzzle game inspired by Wordle, focused on technology-related vocabulary.',
    description:
      'Built with React and Node.js, featuring animated feedback, server-side validation, and persistent stats across multiple word lengths.',
    stack: ['React', 'Axios', 'Node.js'],
    features: [
      'Technology-themed word list and daily puzzle flow',
      'Animated guess feedback and keyboard state',
      'Server-side validation with persistent player stats',
      'Multiple word lengths for replay variety',
    ],
    links: {
      live: 'https://nerdle.nathanzimmerman.com',
      code: 'https://github.com/natezimm/nerdle',
    },
    image: nerdleImgWebp,
    mediaBackground: 'light',
    accent: 'violet',
  },
  {
    slug: 'sudoku',
    title: 'SUDOKU',
    subtitle: 'Logic Board Challenge',
    regionLabel: 'Logic Light Temple',
    summary: 'Interactive Sudoku game built with Angular and ASP.NET.',
    description:
      'Features on-demand puzzle generation, real-time input validation, and persistent stats with resume support.',
    stack: ['Angular', 'ASP.NET', 'C#'],
    features: [
      'On-demand puzzle generation and difficulty flow',
      'Real-time input validation and solution checking',
      'Persistent stats and resume support',
      'Clean separation between gameplay logic and UI state',
    ],
    links: {
      live: 'https://sudoku.nathanzimmerman.com',
      code: 'https://github.com/natezimm/sudoku',
    },
    image: sudokuImgWebp,
    mediaBackground: 'light',
    accent: 'ember',
  },
  {
    slug: 'blackjack',
    title: 'BLACKJACK',
    subtitle: 'Casino Rules Engine',
    regionLabel: 'Casino of Chance',
    summary: 'Full-stack blackjack game built with React and Spring Boot.',
    description:
      'Features session-based gameplay, configurable table rules, and support for split hands, insurance, and live betting.',
    stack: ['React', 'Spring Boot', 'Java'],
    features: [
      'Session-based gameplay and betting lifecycle',
      'Configurable dealer and table rules',
      'Support for split hands, insurance, and live betting',
      'Polished card-table UI with clear round states',
    ],
    links: {
      live: 'https://blackjack.nathanzimmerman.com',
      code: 'https://github.com/natezimm/blackjack',
    },
    image: blackjackImgWebp,
    mediaBackground: 'dark',
    accent: 'gold',
  },
];

export const projectBySlug = (slug: string) =>
  projectEntries.find((project) => project.slug === slug);

export type MapLocation = {
  id: SectionId;
  title: string;
  subtitle: string;
  position: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
};

export const mapLocations: MapLocation[] = [
  {
    id: 'about',
    title: 'FOREST OF FOUNDATIONS',
    subtitle: 'About Me',
    position: { left: '12.6%', top: '46.8%', width: '13.5%', height: '12%' },
  },
  {
    id: 'skills',
    title: 'MOUNTAINS OF MASTERY',
    subtitle: 'Skills & Tools',
    position: { left: '78%', top: '33.4%', width: '13.5%', height: '12%' },
  },
  {
    id: 'projects',
    title: 'PROJECT TOWN',
    subtitle: 'Featured Projects',
    position: { left: '49.8%', top: '49.7%', width: '15%', height: '12%' },
  },
  {
    id: 'experience',
    title: 'CASTLE OF ACHIEVEMENT',
    subtitle: 'Resume & Experience',
    position: { left: '87.8%', top: '74.1%', width: '13.5%', height: '12%' },
  },
  {
    id: 'contact',
    title: 'CAMPFIRE CONTACT',
    subtitle: 'Let’s Connect',
    position: { left: '87.8%', top: '84.5%', width: '13%', height: '10%' },
  },
];

export type ExperienceItem = {
  period: string;
  title: string;
  company: string;
  summary: string;
  tags: string[];
};

export const experienceItems: ExperienceItem[] = [
  {
    period: '2023 - Present',
    title: 'Software Engineer II',
    company: 'Nelnet',
    summary:
      'Built payment-plan and billing workflows across .NET microservices and Angular UI.',
    tags: ['C#', '.NET', 'Angular', 'Azure'],
  },
  {
    period: '2022 - 2023',
    title: 'Software Development Engineer',
    company: 'Amazon',
    summary:
      'Worked on internal risk guidance applications, security hardening, and reliability-focused cloud migrations.',
    tags: ['Java', 'Spring', 'Scala', 'AWS'],
  },
  {
    period: '2019 - 2022',
    title: 'Software Developer',
    company: 'Radian Group, Inc.',
    summary: 'Delivered customer-facing mortgage platform features.',
    tags: ['React', 'Node.js', 'AWS'],
  },
];

export type SkillItem = {
  name: string;
  years: string;
};

export type SkillGroup = {
  label: string;
  items: SkillItem[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: 'LANGUAGES',
    items: [
      { name: 'JavaScript', years: '6+ Years' },
      { name: 'TypeScript', years: '3+ Years' },
      { name: 'Node.js', years: '3+ Years' },
      { name: 'C#', years: '3+ Years' },
      { name: 'Java', years: '3+ Years' },
    ],
  },
  {
    label: 'FRAMEWORKS',
    items: [
      { name: '.NET', years: '3+ Years' },
      { name: 'Angular', years: '3+ Years' },
      { name: 'React', years: '3+ Years' },
    ],
  },
  {
    label: 'DATABASES',
    items: [
      { name: 'MongoDB', years: '3+ Years' },
      { name: 'DynamoDB', years: '3+ Years' },
      { name: 'SQL Server', years: '2+ Years' },
    ],
  },
  {
    label: 'TOOLS & OTHER',
    items: [
      { name: 'Azure', years: '3+ Years' },
      { name: 'AWS', years: '4+ Years' },
      { name: 'REST APIs', years: '6+ Years' },
    ],
  },
];
