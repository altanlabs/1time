import { useEffect, useState } from 'react';
import { translations } from './translations';

export type Language = keyof typeof translations;
type TranslationsType = typeof translations.en;
type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ? `${Key}.${PathImpl<T[Key], keyof T[Key]> & string}` | Key
    : Key
  : never;
type Path<T> = PathImpl<T, keyof T> & string;

export function useTranslation() {
  const [currentLang, setCurrentLang] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang in translations) {
      setCurrentLang(browserLang);
    }
  }, []);

  const t = (key: Path<TranslationsType>) => {
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