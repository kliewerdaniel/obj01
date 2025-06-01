import React from 'react';

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
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6 transition-shadow duration-300 ease-in-out hover:shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 leading-tight mb-3">
        {article.title}
      </h2>

      <div className="text-sm text-gray-600 mb-3 flex items-center">
        <strong className="mr-1 font-medium">Source:</strong> {article.source}
      </div>

      <p className="text-base text-gray-700 leading-relaxed mb-4">
        {article.summary}
      </p>

      <div className="flex justify-between items-center text-sm">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          Read full article
          
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
     
        </a>
        <p> </p>
        <span className="text-xs text-gray-500">
          {new Date(article.published).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default SummaryCard;