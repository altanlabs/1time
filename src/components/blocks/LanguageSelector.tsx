import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'ca', name: 'Català' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'it', name: 'Italiano' },
  { code: 'de', name: 'Deutsch' },
];

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const supported = languages.find(lang => lang.code === browserLang);
    if (supported) {
      setCurrentLang(browserLang);
    }
  }, []);

  return (
    <Select value={currentLang} onValueChange={setCurrentLang}>
      <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}