import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[140px] animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Radial center glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/5 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 mx-auto text-center animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            Hi, I'm <span className="gradient-text">Nathan</span> <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>

          <p className="text-2xl md:text-3xl text-muted-foreground font-light">
            Full-Stack Engineer • Builder • Lifelong Learner
          </p>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Former special education teacher turned software engineer, bringing a human-centered approach to full-stack development. I build clean, intuitive applications using Angular, C#, and AWS, bridging the gap between complex code and user needs.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap pt-4">
            <Button
              size="lg"
              className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
              onClick={() => scrollToSection("projects")}
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-lg rounded-full border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              onClick={() => scrollToSection("contact")}
            >
              Get In Touch
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8">
            {[
              { href: "https://github.com/natezimm", icon: Github, label: "GitHub" },
              { href: "https://www.linkedin.com/in/zimmermannathan", icon: Linkedin, label: "LinkedIn" },
              { href: "mailto:nathan.a.zimmerman@gmail.com", icon: Mail, label: "Email" }
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label={label}
              >
                <Icon className="w-8 h-8" />
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
          aria-label="Scroll to about section"
        >
          <ArrowDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
