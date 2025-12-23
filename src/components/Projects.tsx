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
    <section id="projects" className="py-32 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interactive full-stack projects that combine engineering, design, and gameplay to create engaging user experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={project.title}
                className="glass-card overflow-hidden group border-white/5 card-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden bg-muted/20 rounded-t-2xl">
                  <picture>
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
                      height={324}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 rounded-t-2xl" />
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">{project.title}</CardTitle>
                  <CardDescription className="text-base line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium bg-primary/5 text-primary border border-primary/20 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/50 hover:bg-primary/10"
                        asChild
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View Code"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        asChild
                      >
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View Live Demo"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                    </div>
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
