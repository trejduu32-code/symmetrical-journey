import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShortUrl } from '@/types';
import { isExpired } from '@/lib/utils';

const STORAGE_KEY = 'urlgpt_urls';

export function Redirect() {
  const { code } = useParams<{ code: string }>();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'notfound' | 'expired'>('loading');

  useEffect(() => {
    if (!code) {
      setStatus('notfound');
      return;
    }

    // Load URLs from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setStatus('notfound');
      return;
    }

    const urls: ShortUrl[] = JSON.parse(stored);
    const url = urls.find(u => u.short_code === code);

    if (!url) {
      setStatus('notfound');
      return;
    }

    if (isExpired(url.expires_at)) {
      setStatus('expired');
      // Remove expired URL
      const updatedUrls = urls.filter(u => u.id !== url.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls));
      return;
    }

    // Increment click count
    const updatedUrls = urls.map(u => 
      u.short_code === code ? { ...u, click_count: u.click_count + 1 } : u
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls));

    // Redirect instantly
    window.location.href = url.original_url;
  }, [code]);

  if (status === 'notfound') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center cyber-card p-12 max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Link Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This short link doesn't exist or has been deleted.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            Go to Dashboard
          </a>
        </motion.div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center cyber-card p-12 max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Link Expired</h2>
          <p className="text-muted-foreground mb-6">
            This short link has expired. All links expire after 1 month.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
          >
            Go to Dashboard
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-foreground text-lg glow-text">Redirecting...</p>
      </motion.div>
    </div>
  );
}
