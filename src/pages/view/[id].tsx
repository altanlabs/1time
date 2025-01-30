import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMessage } from '@/lib/api';

export default function ViewMessagePage() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        if (!id) throw new Error('No message ID provided');
        const decryptedMessage = await getMessage(id);
        setMessage(decryptedMessage);
      } catch (err: any) {
        setError(err.message || 'Failed to load message');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex flex-col items-center p-4 sm:p-6 animate-gradient-x">
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
                This message may have expired or already been viewed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Secure Message</h2>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <pre className="whitespace-pre-wrap break-words text-white/90 font-mono">
                  {message}
                </pre>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white/60 text-sm">
                  This message will be deleted after you leave this page
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