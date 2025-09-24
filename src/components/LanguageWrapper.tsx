'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';

export default function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.body.className = `lang-${currentLanguage}`;
  }, [currentLanguage]);

  return <>{children}</>;
}