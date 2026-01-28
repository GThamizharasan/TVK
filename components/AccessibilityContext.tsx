
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, FontScale } from '../types';

interface AccessibilityContextType {
  theme: ThemeMode;
  fontScale: FontScale;
  setTheme: (theme: ThemeMode) => void;
  setFontScale: (scale: FontScale) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => 
    (localStorage.getItem('tvk_theme') as ThemeMode) || 'light'
  );
  const [fontScale, setFontScaleState] = useState<FontScale>(() => 
    (localStorage.getItem('tvk_font_scale') as FontScale) || 'normal'
  );

  useEffect(() => {
    localStorage.setItem('tvk_theme', theme);
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tvk_font_scale', fontScale);
    document.documentElement.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-x-large');
    document.documentElement.classList.add(`font-scale-${fontScale}`);
  }, [fontScale]);

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const setFontScale = (s: FontScale) => setFontScaleState(s);

  return (
    <AccessibilityContext.Provider value={{ theme, fontScale, setTheme, setFontScale }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
