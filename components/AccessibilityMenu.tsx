
import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityContext';
import { ThemeMode, FontScale } from '../types';

const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, fontScale, setTheme, setFontScale } = useAccessibility();

  const themes: { id: ThemeMode; label: string; icon: string }[] = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'high-contrast', label: 'Contrast', icon: '👁️' },
  ];

  const scales: { id: FontScale; label: string; size: string }[] = [
    { id: 'normal', label: 'Default', size: 'Aa' },
    { id: 'large', label: 'Large', size: 'Aa+' },
    { id: 'x-large', label: 'X-Large', size: 'Aa++' },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start">
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 mb-4 w-64 animate-in slide-in-from-bottom-10 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Display Settings</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close settings" className="text-gray-400 hover:text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    aria-label={`Switch to ${t.label} mode`}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                      theme === t.id 
                        ? 'border-red-600 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg mb-1">{t.icon}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-gray-600 dark:text-gray-400">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Scale Selection */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Text Size</p>
              <div className="grid grid-cols-3 gap-2">
                {scales.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFontScale(s.id)}
                    aria-label={`Set text size to ${s.label}`}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                      fontScale === s.id 
                        ? 'border-red-600 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className={`font-bold text-gray-900 dark:text-white mb-1 ${
                      s.id === 'normal' ? 'text-xs' : s.id === 'large' ? 'text-sm' : 'text-base'
                    }`}>{s.size}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-gray-600 dark:text-gray-400">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[8px] font-bold text-center text-gray-400 uppercase tracking-widest">
              Accessibility Standard 2.1
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open accessibility settings"
        aria-expanded={isOpen}
        className="w-14 h-14 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 group"
      >
        <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      </button>
    </div>
  );
};

export default AccessibilityMenu;
