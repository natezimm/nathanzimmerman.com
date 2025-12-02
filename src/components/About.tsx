import { Code2, Database, Rocket, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const skills = [
    {
      icon: Code2,
      title: "Full-Stack Development",
      description: "Building modern, responsive applications with Angular, React, and TypeScript. Experienced in SPA architectures.",
    },
    {
      icon: Database,
      title: "Backend & Architecture",
      description: "Designing robust APIs and microservices using C# (.NET), Node.js, and Java. Proficient with SQL and NoSQL databases.",
    },
    {
      icon: Rocket,
      title: "Cloud & DevOps",
      description: "Building and deploying scalable cloud applications on AWS and Azure. Leveraging CI/CD pipelines to accelerate release cycles and improve reliability.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Strong communicator with a background in education. Collaborative contributor familiar with Agile workflows and cross‑functional teamwork.",
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
              A former teacher turned software engineer passionate about building meaningful products and learning something new every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 animate-slide-in">
              <p className="text-lg leading-relaxed text-foreground/90">
                I originally studied psychology to understand how people work, then transitioned into programming to understand how computers work. My background teaching preschoolers with special needs taught me patience, empathy, and how to communicate complex ideas simply—skills I now use to build software that is reliable, thoughtful, and human-centered.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                As a Full-Stack Engineer, I specialize in building scalable applications with Angular, C#, .NET, and AWS. I enjoy working across the entire stack, from crafting intuitive UIs with React to designing robust backend systems with SQL and DynamoDB.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                When I'm not coding, you can find me cheering on Philly sports teams, playing acoustic guitar, or getting lost in a good fantasy novel.
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
