import { StatsHeader } from '@/components/features/StatsHeader';
import { UrlShortenerForm } from '@/components/forms/UrlShortenerForm';
import { UrlList } from '@/components/features/UrlList';
import { useUrlShortener } from '@/hooks/useUrlShortener';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { urls, stats, createShortUrl, deleteUrl } = useUrlShortener();

  const handleCreateUrl = (url: string, alias?: string) => {
    createShortUrl(url, alias);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold glow-text mb-2">URL Shortener</h2>
            <p className="text-muted-foreground">
              Transform your links into powerful short URLs
            </p>
          </div>

          <StatsHeader stats={stats} />
          <UrlShortenerForm onSubmit={handleCreateUrl} />
          <UrlList urls={urls} onDelete={deleteUrl} />
        </motion.div>
      </div>
    </div>
  );
}
