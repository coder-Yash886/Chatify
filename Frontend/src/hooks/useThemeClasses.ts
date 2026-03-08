import { useTheme } from '../context/ThemeContext';

export const useThemeClasses = () => {
  const { theme } = useTheme();

  return {
    // Backgrounds
    bgPrimary: theme === 'light' ? 'bg-white' : 'bg-[#0a0a0a]',
    bgSecondary: theme === 'light' ? 'bg-gray-50' : 'bg-[#1a1a1a]',
    bgTertiary: theme === 'light' ? 'bg-gray-100' : 'bg-[#2a2a2a]',
    
    // Text
    textPrimary: theme === 'light' ? 'text-gray-900' : 'text-white',
    textSecondary: theme === 'light' ? 'text-gray-600' : 'text-gray-400',
    textTertiary: theme === 'light' ? 'text-gray-500' : 'text-gray-500',
    
    // Borders
    border: theme === 'light' ? 'border-gray-200' : 'border-gray-800',
    borderLight: theme === 'light' ? 'border-gray-100' : 'border-gray-800/50',
    
    // Hover states
    hoverBg: theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800',
    hoverBgLight: theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-900',
    hoverText: theme === 'light' ? 'hover:text-gray-900' : 'hover:text-white',
    
    // Active/Selected states
    activeBg: theme === 'light' ? 'bg-gray-50' : 'bg-gray-900',
    
    // Input fields
    input: theme === 'light' 
      ? 'bg-gray-50 border-gray-200 text-gray-900' 
      : 'bg-[#0a0a0a] border-gray-800 text-white',
  };
};