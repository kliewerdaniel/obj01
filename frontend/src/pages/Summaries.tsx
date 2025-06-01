import React, { useEffect, useState } from 'react';
import SummaryCard, { type Article } from '../components/SummaryCard';

const Summaries: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/graph/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setArticles(data.data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-gray-700 text-lg">Loading summaries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-gray-700 text-lg">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight sm:text-5xl">
          📰 Curated News Summaries
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {articles.map((article) => (
            <SummaryCard key={article.title} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summaries;