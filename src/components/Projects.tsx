import { ExternalLink, Github } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm';
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = ({ variant = 'default', size = 'default', asChild = false, className = '', children, ...props }: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3'
  };
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${children.props.className || ''}`
    });
  }
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
import nerdleImg from "@/assets/project-nerdle.png";
import blackjackImg from "@/assets/project-blackjack.png";
import sudokuImg from "@/assets/project-sudoku.png";
import brickbreakerImg from "@/assets/project-brickbreaker.png";
import React from "react";

const Projects = () => {
  const projects = [
    {
      title: "Brick Breaker Resume",
      description: "Browser-based game built with Phaser.js. The game dynamically generates bricks from the content of a .docx resume file, allowing players to break bricks while interacting with the text of the resume.",
      image: brickbreakerImg,
      github: "https://github.com/natezimm/brick-breaker-resume",
      demo: "https://resume.nathanzimmerman.com",
      tags: ["JavaScript", "Phaser.js", "Mammoth.js"],
    },
    {
      title: "Nerdle",
      description: "Word puzzle game inspired by Wordle, with a focus on technology-related words. Gameplay is similar to Wordle by allowing players to guess a 5-letter word in 6 attempts.",
      image: nerdleImg,
      github: "https://github.com/natezimm/nerdle",
      demo: "https://nerdle.nathanzimmerman.com",
      tags: ["React", "Axios", "Node.js"],
    },
    {
      title: "Blackjack",
      description: "Classic blackjack game built with React, Java, and Spring Boot. Players can play against a dealer with various customizable settings such as the number of decks, whether the dealer hits on soft 17, and whether insurance is available.",
      image: blackjackImg,
      github: "https://github.com/natezimm/blackjack",
      demo: "https://blackjack.nathanzimmerman.com",
      tags: ["React", "Java", "Spring Boot"],
    },
    {
      title: "Sudoku",
      description: "Interactive Sudoku puzzle game. Features puzzle generation, validation, and step-by-step solution visualization.",
      image: sudokuImg,
      github: "https://github.com/natezimm/sudoku",
      demo: "https://sudoku.nathanzimmerman.com",
      tags: ["Angular", "ASP.NET", "C#"],
    },
  ];

  return (
    <section id="projects" className="py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A selection of projects showcasing my skills in full-stack development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card
                key={project.title}
                className="bg-card border-border overflow-hidden card-glow group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl">{project.title}</CardTitle>
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-primary/50 hover:bg-primary/10"
                      asChild
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      asChild
                    >
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
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
