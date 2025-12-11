export interface ShortUrl {
  id: string;
  original_url: string;
  short_code: string;
  click_count: number;
  expires_at: string;
  created_at: string;
}

export interface UrlStats {
  totalLinks: number;
  totalClicks: number;
}
