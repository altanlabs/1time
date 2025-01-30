import { useEffect, useState } from 'react';
import { translations } from './translations';

type Language = 'en' | 'es' | 'ca' | 'fr' | 'pt' | 'it' | 'de';

export function useTranslation() {
  const [currentLang, setCurrentLang] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language;
    if (translations[browserLang]) {
      setCurrentLang(browserLang);
    }
  }, []);

  const t = (key: string) => {
    const keys = key.split('.');
    let value = translations[currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value as string;
  };

  return {
    t,
    currentLang,
    setCurrentLang,
    languages: Object.keys(translations) as Language[],
  };
}