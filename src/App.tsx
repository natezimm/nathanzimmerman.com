import { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Privacy = lazy(() => import('./pages/Privacy'));

const App = () => (
  <ThemeProvider>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/projects/:slug"
          element={
            <Suspense fallback={null}>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={null}>
              <Privacy />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
