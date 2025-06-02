import React from 'react';
import { Clock, ExternalLink, Globe2 } from 'lucide-react';

export interface Article {
  title: string;
  source: string;
  summary: string;
  url: string;
  published: string;
}

interface SummaryCardProps {
  article: Article;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ article }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(article.published);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
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
    <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-shadow duration-200">
      <div className="p-8">
        

        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {article.title}
        </h2>

        <div className="relative mt-4">
          <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${!isExpanded && 'line-clamp-3'}`}>
            {article.summary}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Globe2 className="h-4 w-4" />
            <span>{article.source}</span>
          </div>
          
          <div className="flex items-center gap-1.5" title={fullFormattedDate}>
            <Clock className="h-4 w-4" />
            <time dateTime={article.published}>{formattedDate}</time>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
    

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>Full Article</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default React.memo(SummaryCard);
