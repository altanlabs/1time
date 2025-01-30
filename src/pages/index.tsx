import { useState } from 'react';
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from '@/components/blocks/LanguageSelector';
import { MessageInput, SecureLink } from '@/components/blocks/MessageInput';
import { PasswordGenerator } from '@/components/blocks/PasswordGenerator';
import { createMessage } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from '@/lib/useTranslation';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await createMessage(message);
      if (!response.link) {
        throw new Error('No link generated');
      }
      setGeneratedLink(response.link);
      toast({
        title: "Success",
        description: t('secureLink.created'),
      });
    } catch (error) {
      console.error('Error creating message:', error);
      toast({
        title: "Error",
        description: t('errors.createError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-navy-900 via-indigo-800 to-[#9333ea] flex flex-col items-center p-4 sm:p-6 animate-gradient-x">
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('title')}
          </h1>
          <p className="text-white/80">
            {t('description')}
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <Tabs defaultValue="message" className="p-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="message">{t('tabs.message')}</TabsTrigger>
              <TabsTrigger value="password">{t('tabs.password')}</TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="space-y-6 mt-6">
              <MessageInput onSubmit={handleSubmit} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="password" className="mt-6">
              <PasswordGenerator onSubmit={handleSubmit} isLoading={isLoading} />
            </TabsContent>

            {generatedLink && !isLoading && (
              <div className="mt-6">
                <h3 className="text-white mb-2">{t('secureLink.title')}</h3>
                <SecureLink link={generatedLink} />
                <p className="text-white/60 text-sm mt-2">
                  {t('secureLink.expiry')}
                </p>
              </div>
            )}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}