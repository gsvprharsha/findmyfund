'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { Newspaper } from 'lucide-react';

function getRandomGradient(): string {
  const randomNum = Math.floor(Math.random() * 15) + 1;
  return `/assets/gradients/gradient-${randomNum}.png`;
}

interface NewsItem {
  id: number;
  title: string;
  url: string;
  imageUrl?: string | null;
  source?: string | null;
  createdAt: Date;
}

interface NewsBannerProps {
  initialNews: NewsItem[];
}

function NewsCard({ item }: { item: NewsItem }) {
  const [imageError, setImageError] = useState(false);
  const randomGradient = useMemo(() => getRandomGradient(), []);

  return (
    <Link
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-3 py-2.5 bg-card/50 hover:bg-card/80 border rounded-lg transition-all duration-200 hover:shadow-md min-w-[280px] max-w-[320px] mx-2"
    >
      <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden">
        {item.imageUrl && !imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="56px"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <Image
            src={randomGradient}
            alt="Gradient background"
            fill
            className="object-cover"
            sizes="56px"
            unoptimized
          />
        )}
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {item.source && (
          <div className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 bg-muted/50 rounded-full border border-foreground/20">
            <Image
              src={`https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=16`}
              alt={`${item.source} favicon`}
              width={12}
              height={12}
              className="flex-shrink-0"
              unoptimized
            />
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              {item.source}
            </span>
          </div>
        )}
        <div className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </div>
      </div>
    </Link>
  );
}

export function NewsBanner({ initialNews }: NewsBannerProps) {
  const [news] = useState<NewsItem[]>(initialNews);

  if (!news || news.length === 0) {
    return (
      <div className="w-full py-6">
        <div className="flex items-center gap-3 mb-4">
          <Newspaper className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Latest Startup News</h2>
        </div>
        <div className="flex items-center justify-center py-8 px-4 bg-card/30 rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">No latest news available at this moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="flex items-center gap-3 mb-4">
        <Newspaper className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Latest Startup News</h2>
      </div>
      <div className="relative">
        <InfiniteSlider speedOnHover={10} speed={40} gap={24}>
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </InfiniteSlider>
        {/* Progressive blur on left side */}
        <ProgressiveBlur
          direction="left"
          blurLayers={8}
          blurIntensity={0.4}
          className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none"
        />
        {/* Progressive blur on right side */}
        <ProgressiveBlur
          direction="right"
          blurLayers={8}
          blurIntensity={0.4}
          className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none"
        />
      </div>
    </div>
  );
}
