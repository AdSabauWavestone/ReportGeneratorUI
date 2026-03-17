import { useEffect } from 'react';
import i18n from '@/i18n';
import { useAppStore } from '@/store/app.store';

export function LanguageSync() {
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
