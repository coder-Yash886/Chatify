/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('chatty-theme') as Theme;
    return savedTheme || 'dark';
  });

  useEffect(() => {
    console.log('🎨 Theme changed to:', theme);
    
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('dark', 'light');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Update body background directly
    if (theme === 'light') {
      document.body.style.backgroundColor = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#0a0a0a';
    }
    
    // Save to localStorage
    localStorage.setItem('chatty-theme', theme);
    
    console.log('✅ Applied theme class:', theme);
    console.log('📋 HTML classes:', root.className);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      console.log('🔄 Toggling theme from', prev, 'to', newTheme);
      return newTheme;
    });
  };

  const setTheme = (newTheme: Theme) => {
    console.log('🎯 Setting theme to:', newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};