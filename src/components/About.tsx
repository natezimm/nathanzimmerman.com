import { Code2, Database, Rocket, Users } from "lucide-react";

const About = () => {
  const skills = [
    {
      icon: Code2,
      title: "Full-Stack Development",
      description: "Building modern, responsive applications with Angular, React, Node.js, C#, and .NET",
    },
    {
      icon: Database,
      title: "Backend & Databases",
      description: "Developing robust APIs and services with C# (.NET) and Node.js; experienced with SQL, DynamoDB, and MongoDB",
    },
    {
      icon: Rocket,
      title: "Cloud & DevOps",
      description: "Deploying and maintaining applications using AWS and Azure",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Strong communicator and teammate with a background in education and agile environments",
    },
  ];

  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A former teacher turned software engineer passionate about building meaningful products and learning something new every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 animate-slide-in">
              <p className="text-lg leading-relaxed">
                I started my career teaching preschoolers with special needs — 
                work that taught me patience, empathy, and how to communicate complex ideas simply. 
                That perspective now shapes how I approach engineering: building software that’s reliable, 
                thoughtful, and easy to use.
              </p>
              <p className="text-lg leading-relaxed">
                Currently, I develop full-stack applications using Angular, C#, .NET, and AWS. 
                Previously, I worked with React, Node.js, and AWS, giving me experience across multiple modern stacks. 
                I’ve also worked with SQL, DynamoDB, and MongoDB to build and support scalable data solutions.
              </p>
              <p className="text-lg leading-relaxed">
                Outside of coding, I’m usually watching Philly sports, playing acoustic guitar, or 
                getting lost in a good fantasy novel.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.title}
                    className="bg-card p-6 rounded-lg card-glow border border-border"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="w-8 h-8 text-accent mb-3" />
                    <h3 className="font-semibold mb-2">{skill.title}</h3>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </div>
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
