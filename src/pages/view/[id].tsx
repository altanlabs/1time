import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMessage } from '@/lib/api';
import { useTranslation } from '@/lib/useTranslation';

export default function ViewMessagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        if (!id) throw new Error(t('errors.noId'));
        const decryptedMessage = await getMessage(id);
        setMessage(decryptedMessage);
        
        // Add to browser history to prevent back navigation
        window.history.pushState(null, '', '/');
        
        // Listen for popstate to prevent going back to the message
        const handlePopState = () => {
          navigate('/', { replace: true });
        };
        
        window.addEventListener('popstate', handlePopState);
        
        return () => {
          window.removeEventListener('popstate', handlePopState);
        };
      } catch (err: any) {
        setError(err.message || t('errors.loadError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [id, navigate, t]);

  // Prevent leaving the page accidentally
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (message && !error) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [message, error]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "Success",
        description: t('viewer.copied'),
      });
    } catch (err) {
      toast({
        title: "Error",
        description: t('viewer.copyError'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-navy-900 via-indigo-800 to-[#9333ea] flex flex-col items-center p-4 sm:p-6 animate-gradient-x">
      <div className="w-full max-w-2xl">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 mx-auto text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">{error}</h2>
              <p className="text-white/80">
                {t('viewer.expired')}
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-white/20 hover:bg-white/30"
              >
                {t('viewer.return')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">{t('viewer.title')}</h2>
                <div className="text-white/60 text-sm px-3 py-1 rounded-full bg-white/10">
                  {t('viewer.oneTime')}
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <pre className="whitespace-pre-wrap break-words text-white/90 font-mono">
                  {message}
                </pre>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white/60 text-sm">
                  {t('viewer.deleteWarning')}
                </p>
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  className="hover:bg-white/20"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}