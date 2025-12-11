import { Link2, MousePointerClick } from 'lucide-react';
import { motion } from 'framer-motion';
import { UrlStats } from '@/types';

interface StatsHeaderProps {
  stats: UrlStats;
}

export function StatsHeader({ stats }: StatsHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="cyber-card p-6 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Link2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-muted-foreground text-sm uppercase tracking-wider">Total Links</h3>
          </div>
          <p className="text-4xl font-bold glow-text">{stats.totalLinks}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="cyber-card p-6 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <MousePointerClick className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-muted-foreground text-sm uppercase tracking-wider">Total Clicks</h3>
          </div>
          <p className="text-4xl font-bold glow-text">{stats.totalClicks}</p>
        </div>
      </motion.div>
    </div>
  );
}
