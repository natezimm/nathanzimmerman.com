export type KnowledgeItem = {
  id: string;
  category: 'experience' | 'skills' | 'projects' | 'about' | 'contact';
  title: string;
  subtitle: string;
  answer: string;
  bulletPoints?: string[];
  actionLabel?: string;
  actionHref?: string;
  isExternal?: boolean;
  keywords: string[];
};

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  {
    id: 'resume',
    category: 'about',
    title: 'Download Resume',
    subtitle: 'PDF Document (Latest 2026)',
    answer:
      'Nathan Zimmerman is a Senior Software Engineer with 7+ years of experience across Nelnet, Amazon, and Radian Group.',
    bulletPoints: [
      '7+ years building production software in C#, .NET, Angular, TypeScript, and AWS.',
      'Specialized in billing, payment plans, risk guidance, and microservices.',
    ],
    actionLabel: 'Open Resume PDF',
    actionHref: '/resume.pdf',
    isExternal: true,
    keywords: ['resume', 'cv', 'pdf', 'download', 'bio', 'background', 'hire', 'experience'],
  },
  {
    id: 'nelnet',
    category: 'experience',
    title: 'Nelnet — Software Engineer II',
    subtitle: '10/2023 – Present · Payments & Billing Domain',
    answer:
      'At Nelnet, Nathan builds core features for a greenfield Payment Plans & Billing platform serving educational institutions.',
    bulletPoints: [
      'Spans C#/.NET microservices, Angular, MongoDB, and shared service integrations.',
      'Engineered reusable payment schedule calculator component in Angular/npm.',
      'Built event-driven returned-payment handling with rescheduling, failed-payment logic, and runtime status derivation.',
      'Integrated banking, pricing, disclosure, and messaging microservices.',
    ],
    actionLabel: 'Jump to Nelnet Experience',
    actionHref: '#experience',
    keywords: [
      'nelnet',
      'payments',
      'billing',
      'c#',
      '.net',
      'angular',
      'mongodb',
      'returned payment',
      'schedule',
      'calculator',
      'microservices',
      'current job',
    ],
  },
  {
    id: 'amazon',
    category: 'experience',
    title: 'Amazon — Software Development Engineer',
    subtitle: '05/2022 – 04/2023 · Financial Crime Risk & Platform Migrations',
    answer:
      'At Amazon, Nathan engineered risk-guidance applications to screen third-party sellers against sanctions and financial crime signals.',
    bulletPoints: [
      'Built screening pipelines in Java, Scala, Spring, and AWS against denied-party watchlists and AML indicators.',
      'Executed zero-downtime EC2 host migrations across 10+ applications and 100+ environments.',
      'Hardened cloud security with KMS encryption on SQS/SNS/S3 and least-privilege IAM policies.',
      'Monitored production alarms and resolved deployment failures in high-throughput workflows.',
    ],
    actionLabel: 'Jump to Amazon Experience',
    actionHref: '#experience',
    keywords: [
      'amazon',
      'risk',
      'financial crime',
      'aml',
      'sanctions',
      'java',
      'scala',
      'spring',
      'aws',
      'migration',
      'ec2',
      'security',
      'kms',
    ],
  },
  {
    id: 'radian',
    category: 'experience',
    title: 'Radian Group — Software Developer',
    subtitle: '09/2019 – 04/2022 · Valuation & Asset Management Services',
    answer:
      'At Radian, Nathan contributed to MyRadian, a React and Node.js suite for valuation and asset-management services.',
    bulletPoints: [
      'Delivered full-stack features using React, Node.js, C#/.NET, and AWS.',
      'Troubleshot production issues using CloudWatch, X-Ray, DynamoDB, and SQL.',
      'Automated database reconciliation workflows with Python scripts, eliminating manual operations.',
    ],
    actionLabel: 'Jump to Radian Experience',
    actionHref: '#experience',
    keywords: ['radian', 'react', 'node', 'python', 'reconciliation', 'sql', 'dynamodb', 'aws'],
  },
  {
    id: 'sudoku',
    category: 'projects',
    title: 'Sudoku (.NET Web API + Angular)',
    subtitle: 'Featured Full-Stack Architecture Showcase',
    answer:
      'A full-stack logic puzzle application featuring an on-demand C#/.NET Web API puzzle generator and an Angular client.',
    bulletPoints: [
      'Backend: ASP.NET Core Web API with mathematical constraint validation and rate limiting.',
      'Frontend: Modern Angular with reactive state management and timer persistence.',
      'Tested with CI-backed unit tests for puzzle generation and solver invariants.',
    ],
    actionLabel: 'View Sudoku Demo',
    actionHref: 'https://sudoku.nathanzimmerman.com',
    isExternal: true,
    keywords: [
      'sudoku',
      'c#',
      '.net',
      'angular',
      'web api',
      'full stack',
      'puzzle',
      'solver',
      'flagship',
    ],
  },
  {
    id: 'blackjack',
    category: 'projects',
    title: 'Blackjack (Spring Boot + React)',
    subtitle: 'Session-Backed Casino Rules Engine',
    answer:
      'A casino game engine implementing Las Vegas blackjack rules with Spring Security session management.',
    bulletPoints: [
      'Engineered split hands, double-down, and insurance rules server-side.',
      'Hardened session state and input validation against tampering.',
      'Responsive React frontend with clear round lifecycle states.',
    ],
    actionLabel: 'View Blackjack Demo',
    actionHref: 'https://blackjack.nathanzimmerman.com',
    isExternal: true,
    keywords: ['blackjack', 'spring boot', 'java', 'react', 'cards', 'casino', 'session'],
  },
  {
    id: 'nerdle',
    category: 'projects',
    title: 'Nerdle (Node/Express + React)',
    subtitle: 'Technology Word Game',
    answer:
      'A Wordle-style game featuring technology vocabulary with server-side guess validation.',
    bulletPoints: [
      'Express.js backend validates guesses against curated dictionaries.',
      'Persistent local stats, multiple word lengths, and dark mode styling.',
    ],
    actionLabel: 'View Nerdle Demo',
    actionHref: 'https://nerdle.nathanzimmerman.com',
    isExternal: true,
    keywords: ['nerdle', 'wordle', 'node', 'express', 'react', 'game'],
  },
  {
    id: 'brick-breaker',
    category: 'projects',
    title: 'Brick Breaker Resume (Phaser.js)',
    subtitle: 'Document Parsing & Procedural Level Generator',
    answer:
      'A browser-based Phaser arcade game that parses a live .docx resume into interactive brick levels.',
    bulletPoints: [
      'Uses Mammoth.js to extract structured text from binary .docx files.',
      'Maps text length and density into dynamic brick layouts and difficulty curves.',
    ],
    actionLabel: 'Play Brick Breaker',
    actionHref: 'https://resume.nathanzimmerman.com',
    isExternal: true,
    keywords: ['brick breaker', 'phaser', 'docx', 'parser', 'game', 'resume game'],
  },
  {
    id: 'skills-csharp',
    category: 'skills',
    title: 'C# and .NET Experience',
    subtitle: '3+ Years Professional Experience',
    answer:
      'Nathan has 3+ years building C#/.NET production systems at Nelnet and Radian.',
    bulletPoints: [
      'ASP.NET Core Web API, microservice architectures, and REST endpoints.',
      'Event-driven transaction processing, payment schedule calculation, and status derivation.',
      'Dependency injection, Entity Framework / MongoDB integration, and xUnit testing.',
    ],
    actionLabel: 'Jump to Skills',
    actionHref: '#skills',
    keywords: ['c#', '.net', 'asp.net', 'csharp', 'dotnet', 'backend', 'web api'],
  },
  {
    id: 'skills-angular',
    category: 'skills',
    title: 'Angular & TypeScript Experience',
    subtitle: '3+ Years Professional Experience',
    answer:
      'Nathan has 3+ years building enterprise Angular and TypeScript applications.',
    bulletPoints: [
      'Built multi-tenant admin and payer-facing billing portals at Nelnet.',
      'Authored reusable Angular/npm components for financial schedule calculation.',
      'Proficient in RxJS, reactive forms, standalone components, and TypeScript typing.',
    ],
    actionLabel: 'Jump to Skills',
    actionHref: '#skills',
    keywords: ['angular', 'typescript', 'frontend', 'rxjs', 'npm', 'spa'],
  },
  {
    id: 'skills-cloud-data',
    category: 'skills',
    title: 'Cloud & Database Stack',
    subtitle: 'AWS, Azure, MongoDB, SQL',
    answer:
      'Nathan has extensive cloud and data engineering experience across AWS, Azure, MongoDB, and SQL.',
    bulletPoints: [
      'AWS (6+ years): EC2, SQS, SNS, S3, KMS, CloudWatch, X-Ray, DynamoDB.',
      'Databases: MongoDB (3+ years at Nelnet), SQL Server / Relational SQL, DynamoDB.',
      'Azure: Cloud hosting and microservice integrations.',
    ],
    actionLabel: 'Jump to Skills',
    actionHref: '#skills',
    keywords: ['aws', 'azure', 'cloud', 'mongodb', 'sql', 'database', 'dynamodb', 'sqs', 'sns'],
  },
  {
    id: 'contact-info',
    category: 'contact',
    title: 'Contact & Location',
    subtitle: 'Raritan, NJ · NYC Metro Area',
    answer:
      'Nathan is based in Raritan, NJ (NYC metro area) and is available for senior software engineering roles.',
    bulletPoints: [
      'Email: nathan.a.zimmerman@gmail.com',
      'Phone: 610.955.6578',
      'Location: Central New Jersey (NYC commuter / Hybrid / Remote)',
    ],
    actionLabel: 'Jump to Contact Section',
    actionHref: '#contact',
    keywords: ['contact', 'email', 'phone', 'location', 'new jersey', 'nyc', 'raritan', 'reach'],
  },
];

export const searchKnowledge = (query: string): KnowledgeItem[] => {
  const clean = query.trim().toLowerCase();
  if (!clean) return KNOWLEDGE_BASE.slice(0, 6);

  const tokens = clean.split(/\s+/).filter(Boolean);

  const scored = KNOWLEDGE_BASE.map((item) => {
    let score = 0;

    // Check title match
    if (item.title.toLowerCase().includes(clean)) score += 30;
    // Check keywords
    tokens.forEach((token) => {
      item.keywords.forEach((keyword) => {
        if (keyword === token) score += 20;
        else if (keyword.includes(token)) score += 8;
      });
      if (item.title.toLowerCase().includes(token)) score += 10;
      if (item.subtitle.toLowerCase().includes(token)) score += 5;
      if (item.answer.toLowerCase().includes(token)) score += 4;
    });

    return { item, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
};
