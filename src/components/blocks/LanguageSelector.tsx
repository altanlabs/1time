import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation, Language } from '@/lib/useTranslation';

const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  ca: 'Català',
  fr: 'Français',
  pt: 'Português',
  it: 'Italiano',
  de: 'Deutsch',
};

export function LanguageSelector() {
  const { currentLang, setCurrentLang, languages } = useTranslation();

  const handleLanguageChange = (value: string) => {
    setCurrentLang(value as Language);
  };

  return (
    <Select value={currentLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {languageNames[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}