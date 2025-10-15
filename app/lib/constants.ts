export interface RSSFeedConfig {
  name: string;
  url: string;
}

export const TECHCRUNCH_FEED: Readonly<RSSFeedConfig> = {
  name: 'TechCrunch',
  url: 'https://techcrunch.com/feed/',
} as const;

export const INC42_FEED: Readonly<RSSFeedConfig> = {
  name: 'Inc42',
  url: 'https://inc42.com/feed/',
} as const;

export const ECONOMIC_TIMES_TECH_FEED: Readonly<RSSFeedConfig> = {
  name: 'Economic Times Tech',
  url: 'https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms',
} as const;

export const VENTUREBEAT_FEED: Readonly<RSSFeedConfig> = {
  name: 'VentureBeat',
  url: 'https://venturebeat.com/feed/',
} as const;

export const RSS_FEEDS: readonly RSSFeedConfig[] = [
  TECHCRUNCH_FEED,
  INC42_FEED,
  ECONOMIC_TIMES_TECH_FEED,
  VENTUREBEAT_FEED,
] as const;
