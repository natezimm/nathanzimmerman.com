import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-sky-500/20 selection:text-sky-300 relative">
      {/* Ambient page illumination */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-sky-500/12 via-indigo-500/6 to-transparent blur-3xl opacity-75" />
        <div className="absolute top-[38%] -left-32 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/8 via-transparent to-transparent blur-3xl opacity-60" />
        <div className="absolute top-[72%] -right-32 w-[600px] h-[600px] bg-gradient-radial from-purple-500/8 via-transparent to-transparent blur-3xl opacity-60" />
      </div>

      <div className="relative z-10">
        <Navigation />
        <main className="relative">
          {/* The hero's grid, continued faintly behind the rest of the page */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:28px_28px] opacity-75"
          />
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
