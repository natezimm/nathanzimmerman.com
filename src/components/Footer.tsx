const Footer = () => {
  return (
    <footer className="retro-footer border-t border-violet-400/25 bg-slate-950/95 py-5">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-slate-300">
          <span className="text-rose-400">❤</span> Thanks for stopping by! Built
          with <span className="text-rose-400">❤</span> and pixels.
        </p>
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} Nathan Zimmerman
        </p>
      </div>
    </footer>
  );
};

export default Footer;
