import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
                "relative w-10 h-10 rounded-full transition-all duration-300",
                "hover:bg-accent/50 hover:scale-110",
                "group overflow-hidden"
            )}
            aria-label="Toggle theme"
        >
            {/* Sun icon for light mode */}
            <Sun
                className={cn(
                    "absolute h-5 w-5 transition-all duration-500",
                    "text-amber-500",
                    theme === 'light'
                        ? "rotate-0 scale-100 opacity-100"
                        : "rotate-90 scale-0 opacity-0"
                )}
            />

            {/* Moon icon for dark mode */}
            <Moon
                className={cn(
                    "absolute h-5 w-5 transition-all duration-500",
                    "text-blue-400",
                    theme === 'dark'
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                )}
            />

            {/* Glow effect on hover */}
            <span
                className={cn(
                    "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    theme === 'light'
                        ? "bg-amber-500/10"
                        : "bg-blue-400/10"
                )}
            />
        </Button>
    );
};

export default ThemeToggle;
