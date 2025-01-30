import { useEffect, useState } from 'react';
import { translations } from './translations';

export type Language = 'en' | 'es' | 'ca' | 'fr' | 'pt' | 'it' | 'de';

type TranslationKey = keyof typeof translations.en;
type NestedTranslations = typeof translations.en;

type DotNotation<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}.${DotNotation<T[K]> & string}`
    : K & string;
}[keyof T];

type TranslationDotKey = DotNotation<NestedTranslations>;

export function useTranslation() {
  const [currentLang, setCurrentLang] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language;
    if (Object.keys(translations).includes(browserLang)) {
      setCurrentLang(browserLang);
    }
  }, []);

  const t = (key: TranslationDotKey): string => {
    const keys = key.split('.');
    let value: any = translations[currentLang];
    
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