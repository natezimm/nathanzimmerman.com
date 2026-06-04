import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-xl rounded-md border border-cyan-300/30 bg-slate-900/80 p-8 text-center">
        <h1 className="retro-heading mb-4 text-4xl text-cyan-100">404</h1>
        <p className="mb-6 text-xl text-slate-200">Oops! Page not found</p>
        <a
          href="/"
          className="retro-ui inline-flex rounded-sm border border-amber-300/40 bg-amber-500/15 px-4 py-2 text-xs text-amber-100 hover:bg-amber-500/25"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
