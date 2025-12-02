import { Code2, Database, Rocket, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const skills = [
    {
      icon: Code2,
      title: "Full-Stack Development",
      description: "Building modern, responsive apps with Angular, React, and TypeScript. I enjoy creating smooth, fast experiences for users.",
    },
    {
      icon: Database,
      title: "Backend & Architecture",
      description: "Creating solid backend APIs and services with C#, Node, and Java. Comfortable working with both SQL and NoSQL databases.",
    },
    {
      icon: Rocket,
      title: "Cloud & DevOps",
      description: "Deploying apps to AWS and Azure, and keeping things running smoothly with CI/CD pipelines.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Easy to work with and big on communication. My teaching background helps me explain things clearly and work well with any team.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Former teacher turned software engineer who loves building useful things and learning something new every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 animate-slide-in">
              <p className="text-lg leading-relaxed text-foreground/90">
                I first studied psychology to understand how people think, then got into programming to understand how computers think. Teaching preschoolers with special needs taught me patience, empathy, and how to break down complex ideas—skills I bring into the way I write code and build software.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                As a full‑stack engineer, I’ve worked with Angular, React, C#, .NET, Node, AWS, and more. I like bouncing between frontend and backend—whatever helps bring an idea to life.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                When I’m not coding, I’m probably watching Philly sports, playing guitar, or getting into a good fantasy book.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <Card
                    key={skill.title}
                    className="glass-card border-white/5 hover:border-primary/20 transition-all duration-300 card-glow"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <Icon className="w-10 h-10 text-cyan-400 mb-4" />
                      <h3 className="font-semibold mb-2 text-lg">{skill.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
