import { useState } from 'react';
import { Link, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface UrlShortenerFormProps {
  onSubmit: (url: string, alias?: string) => void;
}

export function UrlShortenerForm({ onSubmit }: UrlShortenerFormProps) {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: 'Error',
        description: 'Please enter a URL',
        variant: 'destructive',
      });
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      onSubmit(url, alias || undefined);
      setUrl('');
      setAlias('');
      toast({
        title: 'Success!',
        description: 'Your short link has been created',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create short link',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card p-6 mb-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            <Link className="inline w-4 h-4 mr-2" />
            Original URL
          </label>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="cyber-input"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            <Sparkles className="inline w-4 h-4 mr-2" />
            Custom Alias (Optional)
          </label>
          <Input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
            placeholder="my-custom-link"
            className="cyber-input"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty for auto-generated code
          </p>
        </div>

        <Button
          type="submit"
          className="w-full cyber-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Shorten URL'}
        </Button>
      </form>
    </motion.div>
  );
}
