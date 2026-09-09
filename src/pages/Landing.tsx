import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Gamepad2,
  Github,
  Menu,
  X,
} from 'lucide-react';
import worldMap from '@/assets/background.webp';
import Contact from '@/components/Contact';
import { experienceItems, projectEntries } from '@/data/portfolioData';
import { trackPortfolioEvent } from '@/lib/analytics';
import './Landing.css';

const navigation = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

const projectPresentation = [
  { slug: 'sudoku', name: 'Sudoku', category: 'Full-stack application' },
  { slug: 'nerdle', name: 'Nerdle', category: 'Daily word puzzle' },
  { slug: 'blackjack', name: 'Blackjack', category: 'Game & rules engine' },
  {
    slug: 'brick-breaker',
    name: 'Brick Breaker',
    category: 'Interactive resume',
  },
];

const toolkit = [
  { label: 'Interface', items: 'Angular · React · TypeScript' },
  { label: 'Behind the scenes', items: 'C# · .NET · Node.js · Java' },
  {
    label: 'Data & infrastructure',
    items: 'MongoDB · SQL Server · AWS · Azure',
  },
];

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      <a href="#main-content" className="lp-skip-link">
        Skip to content
      </a>

      <header
        className="lp-header"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setMenuOpen(false);
            document.getElementById('lp-menu-toggle')?.focus();
          }
        }}
      >
        <div className="lp-container lp-header-inner">
          <a
            className="lp-wordmark"
            href="#home"
            aria-label="Nathan Zimmerman home"
          >
            <span className="lp-monogram" aria-hidden="true">
              nz.
            </span>
            <span>
              Nathan Zimmerman<span className="lp-wordmark-dot">.</span>
            </span>
          </a>

          <nav className="lp-desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="lp-header-actions">
            <a
              className="lp-resume-link"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackPortfolioEvent('resume_click', { source: 'landing_nav' })
              }
            >
              Résumé <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <button
              id="lp-menu-toggle"
              className="lp-menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuOpen}
              aria-controls="lp-mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <nav
          id="lp-mobile-nav"
          className="lp-mobile-nav"
          aria-label="Mobile navigation"
          hidden={!menuOpen}
        >
          {navigation.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="lp-hero" id="home" aria-labelledby="intro-heading">
          <div className="lp-container">
            <div className="lp-hero-topline lp-mono">
              <span>Software engineer / Full stack</span>
              <span>New Jersey, USA</span>
            </div>

            <div className="lp-hero-grid">
              <div className="lp-hero-copy">
                <h1
                  id="intro-heading"
                  aria-label="Thoughtful software. A playful mind."
                >
                  <span>Thoughtful </span>
                  <span>software. </span>
                  <span className="lp-accent">A playful mind.</span>
                </h1>
                <p>
                  I’m Nathan. I build useful, intuitive applications, from the
                  interface to the services behind it. Currently building
                  payment and billing software at Nelnet.
                </p>
                <div className="lp-hero-actions">
                  <a href="#projects" className="lp-button lp-button-primary">
                    Explore my work <ArrowDown size={18} aria-hidden="true" />
                  </a>
                  <a href="#contact" className="lp-text-link">
                    Let’s connect <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="lp-world-wrap">
                <span className="lp-world-note lp-mono">
                  A little off the beaten path
                </span>
                <Link
                  to="/explore"
                  className="lp-world-card"
                  onClick={() =>
                    trackPortfolioEvent('world_enter', {
                      source: 'landing_hero',
                    })
                  }
                >
                  <div className="lp-world-top lp-mono">
                    <span>THE INTERACTIVE PORTFOLIO</span>
                    <Gamepad2 size={22} aria-hidden="true" />
                  </div>
                  <div className="lp-world-image">
                    <img
                      src={worldMap}
                      alt="A pixel-art world of castles, paths, and places to discover Nathan’s projects"
                      width={1536}
                      height={1024}
                      loading="eager"
                    />
                    <span className="lp-world-start">PRESS START</span>
                  </div>
                  <div className="lp-world-bottom">
                    <div>
                      <h2>Welcome to my world.</h2>
                      <p>A different way to get to know my work.</p>
                    </div>
                    <span className="lp-world-arrow">
                      <ArrowUpRight size={25} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="lp-track-record">
              <div className="lp-tenure">
                <strong>Since 2019</strong>
                <span>Building software professionally</span>
              </div>
              <ul aria-label="Professional experience">
                <li className="lp-company-nelnet">
                  Nelnet<span className="lp-mono">CURRENT</span>
                </li>
                <li className="lp-company-amazon">amazon</li>
                <li className="lp-company-radian">
                  radian<span>.</span>
                </li>
              </ul>
              <a
                href="#experience"
                className="lp-track-link"
                aria-label="See my experience"
              >
                <ArrowDown size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          id="projects"
          className="lp-work"
          aria-labelledby="work-heading"
        >
          <div className="lp-container">
            <div className="lp-section-heading">
              <div>
                <p className="lp-eyebrow">
                  <span>01</span> SELECTED WORK
                </p>
                <h2 id="work-heading">Built out of curiosity.</h2>
              </div>
              <p>
                Personal projects that turn ideas into working software. And
                make room for a little fun.
              </p>
            </div>

            <div className="lp-project-grid">
              {projectPresentation.map((presentation, index) => {
                const project = projectEntries.find(
                  (entry) => entry.slug === presentation.slug
                )!;

                return (
                  <article
                    className={`lp-project lp-project-${project.slug}`}
                    key={project.slug}
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      className="lp-project-image"
                      aria-label={`Explore ${presentation.name}`}
                      onClick={() =>
                        trackPortfolioEvent('project_details_click', {
                          project: project.slug,
                          source: 'landing',
                        })
                      }
                    >
                      <div className="lp-project-image-label lp-mono">
                        <span>0{index + 1}</span>
                        <span>{presentation.category}</span>
                      </div>
                      <img
                        src={project.image}
                        alt={`${presentation.name} application screenshot`}
                        width={1200}
                        height={675}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="lp-project-open" aria-hidden="true">
                        <ArrowUpRight size={24} />
                      </span>
                    </Link>
                    <div className="lp-project-info">
                      <div className="lp-project-title-row">
                        <h3>
                          <Link to={`/projects/${project.slug}`}>
                            {presentation.name}
                          </Link>
                        </h3>
                        {project.links.code && (
                          <a
                            href={project.links.code}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${presentation.name} source code on GitHub`}
                            onClick={() =>
                              trackPortfolioEvent('project_code_click', {
                                project: project.slug,
                                source: 'landing',
                              })
                            }
                          >
                            <Github size={21} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                      <p>{project.summary}</p>
                      <ul
                        className="lp-project-stack"
                        aria-label={`${presentation.name} technologies`}
                      >
                        {project.stack.map((technology) => (
                          <li key={technology}>{technology}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
            <a
              className="lp-github-link"
              href="https://github.com/natezimm"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackPortfolioEvent('social_link_click', {
                  destination: 'github',
                  source: 'landing_projects',
                })
              }
            >
              More from my workbench{' '}
              <span>
                Visit GitHub <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </a>
          </div>
        </section>

        <section
          id="about"
          className="lp-background"
          aria-labelledby="about-heading"
        >
          <div className="lp-container">
            <div className="lp-background-grid">
              <div className="lp-about-copy">
                <p className="lp-eyebrow">
                  <span>02</span> THE PERSON BEHIND THE CODE
                </p>
                <h2 id="about-heading">
                  People first.
                  <br /> Code follows.
                </h2>
                <p>
                  I started in psychology and special education. Teaching
                  preschoolers with special needs taught me to listen, be
                  patient, and make complicated things easier to understand.
                </p>
                <p>
                  I bring that same mindset to software. I like working across
                  the stack, asking good questions, and making things simpler
                  for the people who use them.
                </p>
                <a
                  className="lp-text-link"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackPortfolioEvent('resume_click', {
                      source: 'landing_about',
                    })
                  }
                >
                  The full story on my résumé{' '}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>

              <div id="experience" className="lp-experience">
                <h2 className="lp-eyebrow">EXPERIENCE</h2>
                <ol>
                  {experienceItems.map((experience, index) => (
                    <li key={experience.company}>
                      <div className="lp-experience-topline lp-mono">
                        <span>{experience.period.replace(' - ', ' — ')}</span>
                        {index === 0 && (
                          <span className="lp-current">CURRENT</span>
                        )}
                      </div>
                      <h3>{experience.company}</h3>
                      <p className="lp-role">{experience.title}</p>
                      <p className="lp-experience-summary">
                        {experience.summary}
                      </p>
                      <ul
                        className="lp-experience-tags"
                        aria-label={`${experience.company} technologies`}
                      >
                        {experience.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div id="skills" className="lp-toolkit">
              <h2 className="lp-eyebrow">MY EVERYDAY TOOLKIT</h2>
              <dl>
                {toolkit.map((group) => (
                  <div key={group.label}>
                    <dt>{group.label}</dt>
                    <dd>{group.items}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <Contact variant="landing" />
      </main>

      <footer className="lp-footer">
        <div className="lp-container">
          <a className="lp-wordmark" href="#home">
            <span className="lp-monogram" aria-hidden="true">
              nz.
            </span>
            <span>Nathan Zimmerman.</span>
          </a>
          <p>Built with care. And curiosity.</p>
          <a href="#home">
            Back to top <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
