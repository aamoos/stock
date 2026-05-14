import { useEffect } from 'react';
import { useLocalStorage } from '../useLocalStorage';

export type Theme = 'dark' | 'light';

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0d16' : '#f4f6fb');
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggle };
}
