import React from 'react';
import { ExternalLink, Calendar, Globe, Clock, ArrowUpRight } from 'lucide-react';

export interface Article {
  title: string;
  source: string;
  summary: string;
  url: string;
  published: string; // ISO date string (e.g. "2025-05-30T14:22:00Z")
}

interface SummaryCardProps {
  article: Article;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ article }) => {
  // Format published date into a human‐readable string
  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(article.published);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
      }
    } catch {
      return article.published;
    }
  }, [article.published]);

  const fullFormattedDate = React.useMemo(() => {
    try {
      return new Date(article.published).toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return article.published;
    }
  }, [article.published]);

  return (
    <article className="group relative">
      {/* Background with glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/2 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-xl group-hover:shadow-2xl transition-all duration-500" />
      
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 rounded-2xl transition-all duration-500" />
      
      {/* Content */}
      <div className="relative p-8 space-y-6">
        {/* Header with source badge */}
        <header className="space-y-4">
          {/* Source Badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-slate-100/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-600/50">
              <Globe className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {article.source || 'Unknown Source'}
              </span>
            </div>
            
            {/* Time badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/30 dark:to-orange-900/30 backdrop-blur-sm rounded-full border border-amber-200/50 dark:border-amber-700/50">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <time 
                dateTime={article.published}
                title={fullFormattedDate}
                className="text-xs font-medium text-amber-700 dark:text-amber-300"
              >
                {formattedDate}
              </time>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors duration-300">
            {article.title || 'Untitled Article'}
          </h2>
        </header>

        {/* Summary */}
        {article.summary && (
          <div className="space-y-3">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors duration-300">
              {article.summary}
            </p>
          </div>
        )}

        {/* Action Area */}
        <div className="pt-2">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            aria-label={`Read full article: ${article.title}`}
          >
            <span className="text-sm">Read Full Story</span>
            <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>

      {/* Subtle border highlight on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-br group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-indigo-500/20 transition-all duration-500 pointer-events-none" />
    </article>
  );
};

export default SummaryCard;