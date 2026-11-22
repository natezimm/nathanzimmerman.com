import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ThemeToggle = () => {
  // The icons follow the class on <html>, not React state, so the prerendered
  // markup is right for either theme before and after hydration.
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        'relative w-11 h-11 rounded-full transition-all duration-300',
        'hover:bg-accent/50 hover:scale-110',
        'group overflow-hidden'
      )}
      aria-label="Toggle theme"
    >
      {/* Sun icon for light mode */}
      <Sun
        className={cn(
          'absolute h-5 w-5 transition-all duration-500',
          'text-amber-500',
          'rotate-90 scale-0 opacity-0',
          '[html.light_&]:rotate-0 [html.light_&]:scale-100 [html.light_&]:opacity-100'
        )}
      />

      {/* Moon icon for dark mode */}
      <Moon
        className={cn(
          'absolute h-5 w-5 transition-all duration-500',
          'text-blue-400',
          'rotate-0 scale-100 opacity-100',
          '[html.light_&]:-rotate-90 [html.light_&]:scale-0 [html.light_&]:opacity-0'
        )}
      />

      {/* Glow effect on hover */}
      <span
        className={cn(
          'absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          'bg-blue-400/10 [html.light_&]:bg-amber-500/10'
        )}
      />
    </Button>
  );
};

export default ThemeToggle;
