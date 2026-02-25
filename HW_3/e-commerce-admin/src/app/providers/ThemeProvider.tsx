import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectTheme } from '@/features/settings/model/settingsSelectors';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
