import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import nerdleImgWebp from "@/assets/project-nerdle.webp";
import nerdleImgAvif from "@/assets/project-nerdle.avif";
import nerdleImgSmallWebp from "@/assets/project-nerdle-small.webp";
import nerdleImgSmallAvif from "@/assets/project-nerdle-small.avif";
import blackjackImgWebp from "@/assets/project-blackjack.webp";
import blackjackImgAvif from "@/assets/project-blackjack.avif";
import sudokuImgWebp from "@/assets/project-sudoku.webp";
import sudokuImgAvif from "@/assets/project-sudoku.avif";
import sudokuImgSmallWebp from "@/assets/project-sudoku-small.webp";
import sudokuImgSmallAvif from "@/assets/project-sudoku-small.avif";
import brickbreakerImgWebp from "@/assets/project-brickbreaker.webp";
import brickbreakerImgAvif from "@/assets/project-brickbreaker.avif";
import brickbreakerImgSmallWebp from "@/assets/project-brickbreaker-small.webp";
import brickbreakerImgSmallAvif from "@/assets/project-brickbreaker-small.avif";
import blackjackImgSmallWebp from "@/assets/project-blackjack-small.webp";
import blackjackImgSmallAvif from "@/assets/project-blackjack-small.avif";

const Projects = () => {
  const projects = [
    {
      title: "Brick Breaker Resume",
      description: "Browser-based game built with Phaser.js that turns a .docx resume into a playable Brick Breaker level. Resume text is parsed into interactive bricks, combining classic arcade gameplay with a gamified take on a résumé.",
      imageAvif: brickbreakerImgAvif,
      imageWebp: brickbreakerImgWebp,
      imageSmallAvif: brickbreakerImgSmallAvif,
      imageSmallWebp: brickbreakerImgSmallWebp,
      github: "https://github.com/natezimm/brick-breaker-resume",
      demo: "https://resume.nathanzimmerman.com",
      tags: ["JavaScript", "Phaser.js", "Mammoth.js"],
    },
    {
      title: "Nerdle",
      description: "Word puzzle game inspired by Wordle, focused on technology-related vocabulary. Built with React and Node.js, featuring animated feedback, server-side validation, and persistent stats across multiple word lengths.",
      imageAvif: nerdleImgAvif,
      imageWebp: nerdleImgWebp,
      imageSmallAvif: nerdleImgSmallAvif,
      imageSmallWebp: nerdleImgSmallWebp,
      github: "https://github.com/natezimm/nerdle",
      demo: "https://nerdle.nathanzimmerman.com",
      tags: ["React", "Axios", "Node.js"],
    },
    {
      title: "Blackjack",
      description: "Full-stack blackjack game built with React and Spring Boot, featuring session-based gameplay, configurable table rules, and support for split hands, insurance, and live betting.",
      imageAvif: blackjackImgAvif,
      imageWebp: blackjackImgWebp,
      imageSmallAvif: blackjackImgSmallAvif,
      imageSmallWebp: blackjackImgSmallWebp,
      github: "https://github.com/natezimm/blackjack",
      demo: "https://blackjack.nathanzimmerman.com",
      tags: ["React", "Java", "Spring Boot"],
    },
    {
      title: "Sudoku",
      description: "Interactive Sudoku game built with Angular and ASP.NET, featuring on-demand puzzle generation, real-time input validation, and persistent stats with resume support.",
      imageAvif: sudokuImgAvif,
      imageWebp: sudokuImgWebp,
      imageSmallAvif: sudokuImgSmallAvif,
      imageSmallWebp: sudokuImgSmallWebp,
      github: "https://github.com/natezimm/sudoku",
      demo: "https://sudoku.nathanzimmerman.com",
      tags: ["Angular", "ASP.NET", "C#"],
    },
  ];

  return (
    <section id="projects" className="py-16 md:py-20 relative scroll-mt-4">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Interactive full-stack applications combining responsive UI, server-side logic, and interactive gameplay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={project.title}
                className="glass-card overflow-hidden group border border-slate-200/90 dark:border-white/10 rounded-2xl flex flex-col justify-between card-glow hover:border-sky-500/40 dark:hover:border-sky-400/30 transition-all duration-300 shadow-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  {/* Media Preview Box */}
                  <div className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 aspect-[16/9] w-full">
                    <picture className="w-full h-full">
                      <source
                        srcSet={project.imageSmallAvif ? `${project.imageSmallAvif} 600w, ${project.imageAvif} 1200w` : project.imageAvif}
                        sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) calc(50vw - 3rem), 600px"
                        type="image/avif"
                      />
                      <source
                        srcSet={project.imageSmallWebp ? `${project.imageSmallWebp} 600w, ${project.imageWebp} 1200w` : project.imageWebp}
                        sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) calc(50vw - 3rem), 600px"
                        type="image/webp"
                      />
                      <img
                        src={project.imageSmallWebp || project.imageWebp}
                        alt={project.title}
                        width={600}
                        height={338}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>

                  <CardHeader className="pt-6 pb-2">
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300 font-heading">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-foreground/80 leading-relaxed mt-1">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardContent className="pt-4 pb-6 space-y-4">
                  {/* Tech Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 text-xs font-medium bg-slate-100/90 dark:bg-secondary/80 text-foreground/90 border border-slate-200/80 dark:border-white/10 rounded-md transition-all duration-200 hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:bg-sky-500/10 cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-slate-300 dark:border-white/15 bg-slate-100/80 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 text-foreground hover:border-sky-500 dark:hover:border-sky-400/50 transition-all text-xs font-medium shadow-sm"
                      asChild
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View Code"
                      >
                        <Github className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                        Code
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 hover:shadow-primary/40 text-xs font-medium"
                      asChild
                    >
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        Live Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
