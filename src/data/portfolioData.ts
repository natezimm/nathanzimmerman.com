import brickbreakerImgAvif from '@/assets/project-brickbreaker.avif';
import brickbreakerImgAvifSmall from '@/assets/project-brickbreaker-small.avif';
import brickbreakerImgWebp from '@/assets/project-brickbreaker.webp';
import brickbreakerImgWebpSmall from '@/assets/project-brickbreaker-small.webp';
import brickbreakerVideo from '@/assets/video/brick-breaker.mp4';
import brickbreakerDiagram from '@/assets/diagrams/brick-breaker.svg';

import knowBallImgAvif from '@/assets/project-know-ball.avif';
import knowBallImgAvifSmall from '@/assets/project-know-ball-small.avif';
import knowBallImgWebp from '@/assets/project-know-ball.webp';
import knowBallImgWebpSmall from '@/assets/project-know-ball-small.webp';
import knowBallVideo from '@/assets/video/know-ball.mp4';
import knowBallDiagram from '@/assets/diagrams/know-ball.svg';

import rabbitEarsImgAvif from '@/assets/project-rabbit-ears.avif';
import rabbitEarsImgAvifSmall from '@/assets/project-rabbit-ears-small.avif';
import rabbitEarsImgWebp from '@/assets/project-rabbit-ears.webp';
import rabbitEarsImgWebpSmall from '@/assets/project-rabbit-ears-small.webp';
import rabbitEarsVideo from '@/assets/video/rabbit-ears.mp4';
import rabbitEarsDiagram from '@/assets/diagrams/rabbit-ears.svg';

import wheelhouseImgAvif from '@/assets/project-wheelhouse.avif';
import wheelhouseImgAvifSmall from '@/assets/project-wheelhouse-small.avif';
import wheelhouseImgWebp from '@/assets/project-wheelhouse.webp';
import wheelhouseImgWebpSmall from '@/assets/project-wheelhouse-small.webp';
import wheelhouseVideo from '@/assets/video/wheelhouse.mp4';
import wheelhouseDiagram from '@/assets/diagrams/wheelhouse.svg';

export type ProjectMedia = {
  webp: string;
  webpSmall?: string;
  avif?: string;
  avifSmall?: string;
};

export type ProjectHighlight = {
  title: string;
  detail: string;
};

export type ProjectEntry = {
  slug: string;
  title: string;
  /** One line under the title on the project page. */
  tagline: string;
  /** The card's description. */
  summary: string;
  /** Why it exists: the opening paragraph of the project page. */
  problem: string;
  /** Badge on the card's screenshot: a game you play, or an app you try. */
  kind: 'Playable' | 'Live demo';
  stack: string[];
  features: string[];
  highlights: ProjectHighlight[];
  links: {
    live: string;
    code: string;
    architecture: string;
  };
  image: string;
  media: ProjectMedia;
  /** A short silent screen recording, played on hover and on the project page. */
  video: string;
  /** The repository's containers diagram, rendered from docs/diagrams. */
  diagram: string;
  diagramAlt: string;
};

export const projectEntries: ProjectEntry[] = [
  {
    slug: 'wheelhouse',
    title: 'Wheelhouse',
    tagline: 'A family calendar for the kitchen wall and every phone',
    summary:
      "A family calendar for a wall touch screen and every phone in the house, built on the family's own Google Calendar. Edits show up on every screen within a second or two.",
    problem:
      'A shared family calendar is only useful if it is where everyone looks and as quick to change as a whiteboard. Wheelhouse puts Day, Week and Month views on a 1920 × 1080 touch screen in the kitchen and on every phone, while Google Calendar stays the source of truth, so nobody has to switch apps.',
    kind: 'Live demo',
    stack: [
      'ASP.NET Core 10',
      'EF Core',
      'PostgreSQL',
      'SignalR',
      'Angular 22',
      'Docker',
    ],
    features: [
      'Wall display with Day, Week and Month views, each person in their own color',
      'Phone and desktop calendar with keyboard shortcuts',
      'Drag to move, pull to resize, repeats and ten-second undo',
      'Live updates across screens; Google edits arrive within two minutes',
      'Four themes, each with a night look, plus weather and countdowns',
    ],
    highlights: [
      {
        title: 'Google Calendar is the source of truth',
        detail:
          'The API caches Google with incremental sync tokens and writes to Google first with the cached etag in If-Match, so a stale edit gets Google’s version back as a 409 instead of overwriting it.',
      },
      {
        title: 'Optimistic edits with idempotent retries',
        detail:
          'Changes draw at once over the last confirmed snapshot and roll back only the edit that failed. A retried create reuses its creationId, which maps to one deterministic Google event id, so it cannot duplicate.',
      },
      {
        title: 'Live updates from committed change numbers',
        detail:
          'A per-family change number advances in the same transaction as the change. SignalR announces only committed numbers, with no event data, and clients re-read their visible days.',
      },
      {
        title: 'Family isolation by default',
        detail:
          'Every family-owned table has an EF Core query filter on the signed-in family, so a query that forgets the family returns nothing rather than someone else’s events.',
      },
      {
        title: 'Staged, automatic releases',
        detail:
          'Each merge is tagged, built into images and deployed to the demo first; family instances move only after the demo passes a browser smoke check.',
      },
    ],
    links: {
      live: 'https://calendar.nathanzimmerman.com',
      code: 'https://github.com/natezimm/wheelhouse',
      architecture:
        'https://github.com/natezimm/wheelhouse/blob/main/docs/architecture.md',
    },
    image: wheelhouseImgWebp,
    media: {
      webp: wheelhouseImgWebp,
      webpSmall: wheelhouseImgWebpSmall,
      avif: wheelhouseImgAvif,
      avifSmall: wheelhouseImgAvifSmall,
    },
    video: wheelhouseVideo,
    diagram: wheelhouseDiagram,
    diagramAlt:
      'The wall display and phones reach an nginx web container over HTTPS and WebSocket; it proxies to the ASP.NET Core API, which uses PostgreSQL, syncs with Google Calendar and reads weather from Open-Meteo.',
  },
  {
    slug: 'know-ball',
    title: 'Know Ball',
    tagline: 'Daily sports trivia, fed by every NBA player since 1947',
    summary:
      'Daily sports trivia: a word game, two guess-the-player games and a stats quiz, with a new puzzle every midnight Eastern. Fed by a nightly import of every NBA player since 1947.',
    problem:
      'Daily puzzle games live or die on fairness and trust: the answer cannot leak, a flaky connection cannot cost a guess, and tomorrow’s puzzle has to exist even when a data source has a bad night. Know Ball is built around those three promises.',
    kind: 'Playable',
    stack: [
      'ASP.NET Core 10',
      'EF Core',
      'PostgreSQL',
      'Angular 22',
      'PWA',
      'Docker',
    ],
    features: [
      'Spordle: a sports word in six tries',
      'Scouting Report and Career Path: guess today’s NBA player',
      'Numbers Don’t Lie: five stats questions across four leagues',
      'Practice rounds, an archive, streaks and a spoiler-free share card',
      'Installable on a phone and built phone-first',
    ],
    highlights: [
      {
        title: 'Answers never leave the server early',
        detail:
          'Each puzzle keeps its public payload apart from its secret; guesses are graded on the server and the answer is attached only once the game is won or lost.',
      },
      {
        title: 'Retries never cost a guess',
        detail:
          'Guesses carry a client requestId and are saved with a compare-and-swap, so a dropped response or two open tabs cannot spend or lose a guess.',
      },
      {
        title: 'A defensive nightly import',
        detail:
          'Imports are repeatable (CI runs them twice and expects no change), and a feed that suddenly returns under half the league fails the run instead of retiring everyone.',
      },
      {
        title: 'Clean layers, two databases',
        detail:
          'Domain, Application and Infrastructure layers share one game engine that new games plug into, and the tests run the same code on SQLite and PostgreSQL.',
      },
      {
        title: 'Abuse limits that hold behind a proxy',
        detail:
          'Per-address rate limits with stricter ones on guesses, IPv6 counted by /64, and X-Forwarded-For trusted only from known proxies.',
      },
    ],
    links: {
      live: 'https://knowball.nathanzimmerman.com',
      code: 'https://github.com/natezimm/know-ball',
      architecture:
        'https://github.com/natezimm/know-ball/blob/main/docs/architecture.md',
    },
    image: knowBallImgWebp,
    media: {
      webp: knowBallImgWebp,
      webpSmall: knowBallImgWebpSmall,
      avif: knowBallImgAvif,
      avifSmall: knowBallImgAvifSmall,
    },
    video: knowBallVideo,
    diagram: knowBallDiagram,
    diagramAlt:
      'The browser reaches the host nginx over HTTPS, which forwards to the KnowBall API on a GCP VM; the API and a nightly importer share PostgreSQL, and the importer reads Basketball-Reference, Wikidata and ESPN.',
  },
  {
    slug: 'rabbit-ears',
    title: 'Rabbit Ears',
    tagline: 'A 90s TV for the living room, on a curved CRT picture',
    summary:
      'Folders of old shows become channels on a curved CRT picture, driven by an IR or phone remote. The demo gives every visitor a TV of their own, with their phone as the remote.',
    problem:
      'Streaming apps ask what you want to watch; old TV just had something on. Rabbit Ears brings back flipping channels on a mini PC under the TV, and two remotes, a browser page and a video player all have to agree on what is on screen without ever disagreeing.',
    kind: 'Live demo',
    stack: ['ASP.NET Core 10', 'SignalR', 'Angular 22', 'WebGL', 'mpv'],
    features: [
      'Each folder is a channel, already playing when you tune in',
      'Live, Resume and Random channel modes on an endless shuffle',
      'A bent tube picture with scanlines and a chunky green banner',
      'IR and phone remotes that drive the same TV',
      'A demo VCR that plays your own videos without uploading them',
    ],
    highlights: [
      {
        title: 'The server is the only source of truth',
        detail:
          'The TV is a pure state machine with injected time and randomness, unit tested by single-stepping it; clients send button presses and render full snapshots.',
      },
      {
        title: 'Play tokens and sequence counters',
        detail:
          'Reports from the screen are safe to arrive late, twice or out of order, and any one snapshot can rebuild the whole display.',
      },
      {
        title: 'One picture, two renderers',
        detail:
          'A WebGL shader in the browser and the same tube maths as an mpv hook shader on the box, with mpv driven over its JSON IPC socket.',
      },
      {
        title: 'No dead frames',
        detail:
          'Two video elements swap, so the next episode is loaded and seeked before the cut.',
      },
      {
        title: 'A public demo without accounts',
        detail:
          'Per-visitor rooms, idle cleanup and per-address rate limits, deliberately not authentication.',
      },
    ],
    links: {
      live: 'https://rabbitears.nathanzimmerman.com',
      code: 'https://github.com/natezimm/rabbit-ears',
      architecture:
        'https://github.com/natezimm/rabbit-ears/blob/main/docs/architecture.md',
    },
    image: rabbitEarsImgWebp,
    media: {
      webp: rabbitEarsImgWebp,
      webpSmall: rabbitEarsImgWebpSmall,
      avif: rabbitEarsImgAvif,
      avifSmall: rabbitEarsImgAvifSmall,
    },
    video: rabbitEarsVideo,
    diagram: rabbitEarsDiagram,
    diagramAlt:
      'The phone remote sends button presses to a SignalR hub; TvService applies them to a pure Television state machine and broadcasts full snapshots to the remote, the browser TV page and mpv on the box.',
  },
  {
    slug: 'brick-breaker',
    title: 'Brick Breaker Resume',
    tagline: 'A résumé you play one bounce at a time',
    summary:
      'A Phaser 3 game that turns a Word résumé into a Brick Breaker level: every word is a brick. Two looks, Glass and Paper, and you can switch between them mid-game.',
    problem:
      'Résumés all look alike. This one is a level: a build step turns the .docx into words, every word becomes a brick, and the page stays crisp and readable while you break it apart.',
    kind: 'Playable',
    stack: ['JavaScript', 'Phaser 3', 'Vite', 'Mammoth', 'Jest', 'Playwright'],
    features: [
      'Every word of the résumé is a brick, sized to fit it',
      'Glass and Paper looks, switchable mid-game',
      'Settings that pause the game, with a live preview',
      'Lives, score and a saved best',
      'Mouse, touch and keyboard',
    ],
    highlights: [
      {
        title: 'Résumé as build-time data',
        detail:
          'Mammoth and JSDOM turn the .docx into JSON before each build, so the game always matches the document and never ships a parser to the browser.',
      },
      {
        title: 'DOM bricks, Phaser physics',
        detail:
          'Each brick is a DOM element so the type stays crisp, paired with an invisible static physics body; the canvas draws only the ball and paddle.',
      },
      {
        title: 'Two layouts, one word index',
        detail:
          'The wall and the typeset page give every word the same index, so a theme switch rebuilds only the bricks that are left.',
      },
      {
        title: 'Fast first paint',
        detail:
          'Phaser is a separate chunk loaded only after a look is chosen.',
      },
    ],
    links: {
      live: 'https://resume.nathanzimmerman.com',
      code: 'https://github.com/natezimm/brick-breaker-resume',
      architecture:
        'https://github.com/natezimm/brick-breaker-resume/blob/main/docs/architecture.md',
    },
    image: brickbreakerImgWebp,
    media: {
      webp: brickbreakerImgWebp,
      webpSmall: brickbreakerImgWebpSmall,
      avif: brickbreakerImgAvif,
      avifSmall: brickbreakerImgAvifSmall,
    },
    video: brickbreakerVideo,
    diagram: brickbreakerDiagram,
    diagramAlt:
      'The player drives the start page, which loads the Phaser scene on Play; both use the brick layout, which fetches resume.json and draws DOM bricks, and settings live in localStorage.',
  },
];

export const projectBySlug = (slug: string) =>
  projectEntries.find((project) => project.slug === slug);

export type EarlierProject = {
  title: string;
  summary: string;
  stack: string[];
  code: string;
};

/** Retired projects: their live demos are offline, so they link to code only. */
export const earlierProjects: EarlierProject[] = [
  {
    title: 'Nerdle',
    summary:
      'A Wordle-style game with technology words, server-side validation and stats across word lengths.',
    stack: ['React', 'Node.js', 'Express'],
    code: 'https://github.com/natezimm/nerdle',
  },
  {
    title: 'Sudoku',
    summary:
      'Sudoku with on-demand puzzle generation, live validation and saved progress.',
    stack: ['Angular', 'ASP.NET Core', 'C#'],
    code: 'https://github.com/natezimm/sudoku',
  },
  {
    title: 'Blackjack',
    summary:
      'Blackjack with configurable table rules, split hands, insurance and betting.',
    stack: ['React', 'Spring Boot', 'Java'],
    code: 'https://github.com/natezimm/blackjack',
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
    tags: ['C#', '.NET', 'Angular', 'Azure', 'AWS'],
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
    tags: ['Node.js', 'React', 'AWS'],
  },
];

export type CareerOriginItem = {
  title: string;
  detail: string;
};

// The path before engineering, newest first like experienceItems.
export const careerOriginItems: CareerOriginItem[] = [
  {
    title: 'Special education teacher',
    detail:
      'Preschool classrooms taught me patience, empathy, and how to break down complex ideas.',
  },
  {
    title: 'Studied psychology',
    detail: 'Learned how people think before learning how computers think.',
  },
];
