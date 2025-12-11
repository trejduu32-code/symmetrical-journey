import { Copy, ExternalLink, Trash2, Calendar, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShortUrl } from '@/types';
import { formatDate, getBaseUrl, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UrlListProps {
  urls: ShortUrl[];
  onDelete: (id: string) => void;
}

export function UrlList({ urls, onDelete }: UrlListProps) {
  const { toast } = useToast();

  const handleCopy = async (shortCode: string) => {
    const shortUrl = `${getBaseUrl()}/${shortCode}`;
    await copyToClipboard(shortUrl);
    toast({
      title: 'Copied!',
      description: 'Short link copied to clipboard',
    });
  };

  if (urls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="cyber-card p-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">No links yet</h3>
          <p className="text-muted-foreground">
            Create your first shortened URL using the form above
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {urls.map((url, index) => (
          <motion.div
            key={url.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
            className="cyber-card p-6 hover:shadow-cyber-glow transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <a
                    href={url.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors truncate font-medium"
                  >
                    {url.original_url}
                  </a>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <code className="bg-primary/10 px-2 py-1 rounded text-primary font-mono">
                    /{url.short_code}
                  </code>
                  <div className="flex items-center gap-1">
                    <MousePointerClick className="w-4 h-4" />
                    <span>{url.click_count} clicks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Expires: {formatDate(url.expires_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(url.short_code)}
                  className="cyber-border"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(url.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
