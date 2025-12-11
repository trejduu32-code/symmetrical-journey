import { Link, useLocation } from 'react-router-dom';
import { Terminal, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Terminal className="w-8 h-8 text-primary group-hover:animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all" />
            </div>
            <div>
              <h1 className="text-2xl font-bold glow-text">URLGPT</h1>
              <p className="text-xs text-muted-foreground">Cyber Link Shortener</p>
            </div>
          </Link>

          <nav className="flex gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                isActive('/')
                  ? 'bg-primary text-primary-foreground shadow-cyber-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/widget"
              className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 ${
                isActive('/widget')
                  ? 'bg-primary text-primary-foreground shadow-cyber-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Widget
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
