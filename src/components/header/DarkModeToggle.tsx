
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { toast } = useToast();

  // Initialize theme based on localStorage or user preference
  useEffect(() => {
    // Check if user previously set a preference
    const savedTheme = localStorage.getItem('theme');
    
    // Check for system preference if no saved preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply dark mode if saved preference is 'dark' or system prefers dark
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast({
      title: newMode ? "Dark mode enabled" : "Light mode enabled",
      description: "Your preference has been saved.",
      duration: 2000,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-gray-600 dark:text-gray-300"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{darkMode ? "Switch to light mode" : "Switch to dark mode"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DarkModeToggle;
