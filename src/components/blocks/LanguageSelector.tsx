import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from '@/lib/useTranslation';

const languageNames = {
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

  return (
    <Select value={currentLang} onValueChange={setCurrentLang}>
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