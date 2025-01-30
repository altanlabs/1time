import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider"
import { useTranslation } from '@/lib/useTranslation';

interface PasswordGeneratorProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export function PasswordGenerator({ onSubmit, isLoading }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setGeneratedPassword(password);
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      toast({
        title: "Success",
        description: t('secureLink.copied'),
      });
    } catch (err) {
      toast({
        title: "Error",
        description: t('secureLink.copyError'),
        variant: "destructive",
      });
    }
  };

  const handleCreateLink = async () => {
    if (!generatedPassword) {
      toast({
        title: "Error",
        description: t('passwordGen.generateFirst'),
        variant: "destructive",
      });
      return;
    }
    onSubmit(generatedPassword);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>{t('passwordGen.length')}: {length}</Label>
          </div>
          <Slider
            value={[length]}
            onValueChange={(value) => setLength(value[0])}
            min={8}
            max={32}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
            />
            <Label htmlFor="numbers">{t('passwordGen.includeNumbers')}</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
            />
            <Label htmlFor="symbols">{t('passwordGen.includeSymbols')}</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
            />
            <Label htmlFor="uppercase">{t('passwordGen.includeUppercase')}</Label>
          </div>
        </div>

        <Button
          onClick={generatePassword}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          {t('passwordGen.generate')}
        </Button>
      </div>

      {generatedPassword && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex-1 font-mono">{generatedPassword}</div>
            <Button
              size="icon"
              variant="ghost"
              onClick={copyToClipboard}
              className="hover:bg-white/20"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleCreateLink}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {t('passwordGen.creating')}
              </span>
            ) : (
              t('passwordGen.createLink')
            )}
          </Button>
        </div>
      )}
    </div>
  );
}