import { useState } from 'react';
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from '@/components/blocks/LanguageSelector';
import { MessageInput, SecureLink } from '@/components/blocks/MessageInput';
import { PasswordGenerator } from '@/components/blocks/PasswordGenerator';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleMessageSubmit = async (message: string) => {
    setIsLoading(true);
    // TODO: Implement actual message encryption and API call
    setTimeout(() => {
      setGeneratedLink('https://1time.share/m/abc123xyz789');
      setIsLoading(false);
    }, 1500);
  };

  const handlePasswordGenerate = (password: string) => {
    handleMessageSubmit(password);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex flex-col items-center p-4 sm:p-6 animate-gradient-x">
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Secure One-Time Message Sharing
          </h1>
          <p className="text-white/80">
            Share sensitive information securely. Messages self-destruct after being viewed.
          </p>
        </div>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <Tabs defaultValue="message" className="p-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="message">Manual Input</TabsTrigger>
              <TabsTrigger value="password">Password Generator</TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="space-y-6 mt-6">
              <MessageInput onSubmit={handleMessageSubmit} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="password" className="mt-6">
              <PasswordGenerator onGenerate={handlePasswordGenerate} />
            </TabsContent>

            {generatedLink && !isLoading && (
              <div className="mt-6">
                <h3 className="text-white mb-2">Your Secure Link:</h3>
                <SecureLink link={generatedLink} />
                <p className="text-white/60 text-sm mt-2">
                  This link will expire in 24 hours or after being viewed once.
                </p>
              </div>
            )}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}