import React from 'react';
import { ExternalLink, Calendar, Globe } from 'lucide-react';

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
      return new Date(article.published).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return article.published;
    }
  }, [article.published]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Read full article: ${article.title}`}
        className="group block w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-none hover:border-gray-700 transition-all duration-300 hover:bg-gray-850"
      >
        {/* Content container with generous spacing */}
        <div className="px-16 py-20 text-center space-y-16">
          {/* Title Section */}
          <header className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-light text-white leading-tight tracking-tight max-w-3xl mx-auto group-hover:text-gray-100 transition-colors duration-300">
              {article.title || 'Untitled'}
            </h2>
          </header>

          {/* Metadata Section */}
          <div className="flex flex-col items-center space-y-12">
            {/* Source */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full group-hover:bg-gray-750 transition-colors duration-300">
                <Globe className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                  Source
                </div>
                <div className="text-lg text-gray-300 font-light">
                  {article.source || 'Unknown'}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-16 bg-gray-800"></div>

            {/* Published Date */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full group-hover:bg-gray-750 transition-colors duration-300">
                <Calendar className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                  Published
                </div>
                <time
                  dateTime={article.published}
                  className="text-lg text-gray-300 font-light"
                >
                  {formattedDate}
                </time>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          {article.summary && (
            <div className="space-y-8">
              <div className="w-24 h-px bg-gray-800 mx-auto"></div>
              <p className="text-xl md:text-2xl font-light text-gray-400 leading-relaxed max-w-2xl mx-auto group-hover:text-gray-300 transition-colors duration-300">
                {article.summary}
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="pt-8">
            <div className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-black hover:bg-gray-100 transition-all duration-300 group-hover:scale-105">
              <span className="text-sm uppercase tracking-wider font-medium">
                Read Full Article
              </span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};
export default SummaryCard;