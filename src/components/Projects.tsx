import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import nerdleImg from "@/assets/project-nerdle.png";
import blackjackImg from "@/assets/project-blackjack.png";
import sudokuImg from "@/assets/project-sudoku.png";
import brickbreakerImg from "@/assets/project-brickbreaker.png";

const Projects = () => {
  const projects = [
    {
      title: "Brick Breaker Resume",
      description: "Browser-based game built with Phaser.js that transforms the content of a .docx resume into interactive brick elements. Dynamically parses text and renders it into gameplay for a unique, gamified résumé experience.",
      image: brickbreakerImg,
      github: "https://github.com/natezimm/brick-breaker-resume",
      demo: "https://resume.nathanzimmerman.com",
      tags: ["JavaScript", "Phaser.js", "Mammoth.js"],
    },
    {
      title: "Nerdle",
      description: "Word puzzle game inspired by Wordle, focused on technology-related vocabulary. Built with React and Node.js, allowing players to guess a randomized 5-letter word within 6 attempts with real-time feedback.",
      image: nerdleImg,
      github: "https://github.com/natezimm/nerdle",
      demo: "https://nerdle.nathanzimmerman.com",
      tags: ["React", "Axios", "Node.js"],
    },
    {
      title: "Blackjack",
      description: "Full-stack blackjack game built with React and Spring Boot, featuring realistic dealer logic and configurable rule sets (decks, soft 17, and insurance). Supports fast, responsive gameplay with client–server communication.",
      image: blackjackImg,
      github: "https://github.com/natezimm/blackjack",
      demo: "https://blackjack.nathanzimmerman.com",
      tags: ["React", "Java", "Spring Boot"],
    },
    {
      title: "Sudoku",
      description: "Interactive Sudoku puzzle game built with Angular and ASP.NET, including algorithmic puzzle generation, real-time validation, and step-by-step solution visualization.",
      image: sudokuImg,
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
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
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
