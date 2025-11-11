import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 py-8 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nathan Zimmerman  - Thanks for stopping by
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/natezimm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/zimmermannathan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:nathan.a.zimmerman@gmail.com"
              className="text-foreground/70 hover:text-accent transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
