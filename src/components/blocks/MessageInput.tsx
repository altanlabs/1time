import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from '@/lib/useTranslation';

interface MessageInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSubmit, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: t('errors.noMessage'),
        variant: "destructive",
      });
      return;
    }
    onSubmit(message);
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={t('messageInput.placeholder')}
        className="min-h-[150px] resize-y bg-white/10 backdrop-blur-sm"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {t('messageInput.creating')}
            </span>
          ) : (
            t('messageInput.createLink')
          )}
        </Button>
      </div>
    </div>
  );
}

interface SecureLinkProps {
  link: string;
}

export function SecureLink({ link }: SecureLinkProps) {
  const { toast } = useToast();
  const { t } = useTranslation();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
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

  return (
    <div className="flex items-center gap-2 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
      <div className="flex-1 truncate font-mono text-sm">
        {link}
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={copyToClipboard}
        className="hover:bg-white/20"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}