import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { type ViewMode } from "@/data/portfolioData";

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("map");

  return (
    <div className="retro-shell min-h-screen" data-view-mode={viewMode}>
      <Navigation viewMode={viewMode} onViewModeChange={setViewMode} />
      <main>
        <Hero viewMode={viewMode} />
        <About viewMode={viewMode} />
        <Projects viewMode={viewMode} />
        <Experience viewMode={viewMode} />
        <Skills viewMode={viewMode} />
        <Contact viewMode={viewMode} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
