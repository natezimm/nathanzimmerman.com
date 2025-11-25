import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
  children: React.ReactNode;
}

const Button = ({ variant = 'default', size = 'default', className = '', children, ...props }: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    lg: 'h-11 rounded-md px-8'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      
      {/* Colorful blue/green overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-500/20 mix-blend-overlay pointer-events-none" />

      {/* Radial center glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-radial from-cyan-400/25 via-blue-500/20 to-transparent blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container px-4 mx-auto text-center animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold">
            Hi, I'm <span className="gradient-text">Nathan</span> <span className="inline-block animate-wave">👋</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground">
            Full-Stack Engineer • Builder • Lifelong Learner          
          </p>
          
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Former special education teacher turned software engineer. I love creating clean, intuitive web applications with modern tools like Angular, C#, and AWS.

            Always learning, building, and finding new ways to make technology more human.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => scrollToSection("projects")}
            >
              View My Work
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
              onClick={() => scrollToSection("contact")}
            >
              Get In Touch
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4">
            <a 
              href="https://github.com/natezimm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-accent transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/zimmermannathan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-accent transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="mailto:nathan.a.zimmerman@gmail.com"
              className="text-foreground/70 hover:text-accent transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>

        <button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-accent animate-bounce"
          aria-label="Scroll to about section"
        >
          <ArrowDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
