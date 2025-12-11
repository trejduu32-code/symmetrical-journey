import { useState, useEffect } from 'react';
import { ShortUrl, UrlStats } from '@/types';
import { generateShortCode, getExpirationDate, isExpired } from '@/lib/utils';

const STORAGE_KEY = 'urlgpt_urls';

export function useUrlShortener() {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [stats, setStats] = useState<UrlStats>({ totalLinks: 0, totalClicks: 0 });

  // Load URLs from localStorage on mount
  useEffect(() => {
    loadUrls();
  }, []);

  // Update stats whenever URLs change
  useEffect(() => {
    const totalClicks = urls.reduce((sum, url) => sum + url.click_count, 0);
    setStats({
      totalLinks: urls.length,
      totalClicks,
    });
  }, [urls]);

  const loadUrls = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedUrls: ShortUrl[] = JSON.parse(stored);
      // Filter out expired URLs
      const activeUrls = parsedUrls.filter(url => !isExpired(url.expires_at));
      setUrls(activeUrls);
      
      // Update storage if we removed expired URLs
      if (activeUrls.length !== parsedUrls.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeUrls));
      }
    }
  };

  const saveUrls = (newUrls: ShortUrl[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUrls));
    setUrls(newUrls);
  };

  const createShortUrl = (originalUrl: string, customAlias?: string): ShortUrl => {
    // Check if custom alias exists and is still active (not expired)
    if (customAlias) {
      const existingUrl = urls.find(url => url.short_code === customAlias);
      if (existingUrl && !isExpired(existingUrl.expires_at)) {
        throw new Error('Custom alias already exists');
      }
      // If expired, it will be filtered out, so we can reuse the code
    }

    const newUrl: ShortUrl = {
      id: crypto.randomUUID(),
      original_url: originalUrl,
      short_code: customAlias || generateShortCode(),
      click_count: 0,
      expires_at: getExpirationDate(),
      created_at: new Date().toISOString(),
    };

    const updatedUrls = [newUrl, ...urls];
    saveUrls(updatedUrls);
    return newUrl;
  };

  const deleteUrl = (id: string) => {
    const updatedUrls = urls.filter(url => url.id !== id);
    saveUrls(updatedUrls);
  };

  const getUrlByCode = (code: string): ShortUrl | null => {
    const url = urls.find(u => u.short_code === code);
    if (!url) return null;
    if (isExpired(url.expires_at)) {
      deleteUrl(url.id);
      return null;
    }
    return url;
  };

  const incrementClicks = (code: string) => {
    const updatedUrls = urls.map(url => {
      if (url.short_code === code) {
        return { ...url, click_count: url.click_count + 1 };
      }
      return url;
    });
    saveUrls(updatedUrls);
  };

  return {
    urls,
    stats,
    createShortUrl,
    deleteUrl,
    getUrlByCode,
    incrementClicks,
  };
}
