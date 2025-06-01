import React, { useEffect, useState, useCallback } from 'react';
import SummaryCard, { type Article } from '../components/SummaryCard';
import { RefreshCw, AlertCircle, Globe2 } from 'lucide-react';

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading stories...</p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <AlertCircle className="w-8 h-8 text-red-500" />
    <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
      Something went wrong
    </h2>
    <p className="mt-2 text-red-600 dark:text-red-400" role="alert">
      {message}
    </p>
  </div>
);

const NoDataState = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Globe2 className="w-8 h-8 text-gray-400" />
    <p className="mt-4 text-gray-600 dark:text-gray-400">
      No stories available yet
    </p>
  </div>
);

const Summaries = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/graph/');
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      const sorted = [...data.data].sort(
        (a: Article, b: Article) => new Date(b.published).getTime() - new Date(a.published).getTime()
      );
      setArticles(sorted);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  const runPipeline = useCallback(async () => {
    setPipelineRunning(true);
    setPipelineStatus(null);
    try {
      const res = await fetch('/api/run_pipeline');
      if (!res.ok) throw new Error('Pipeline failed to run');
      const data = await res.json();

      if (data.status === 'success') {
        setPipelineStatus('Pipeline executed successfully.');
        await fetchArticles();
      } else {
        setPipelineStatus(`Pipeline failed: ${data.message || data.stderr}`);
      }
    } catch (err: any) {
      setPipelineStatus(`Error running pipeline: ${err.message}`);
    } finally {
      setPipelineRunning(false);
    }
  }, [fetchArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!articles.length) return <NoDataState />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">


        <button
          onClick={runPipeline}
          disabled={pipelineRunning}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            ${pipelineRunning
              ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30'
            }
          `}
        >
          <RefreshCw className={`w-4 h-4 ${pipelineRunning ? 'animate-spin' : ''}`} />
          <span>{pipelineRunning ? 'Updating...' : 'Refresh Stories'}</span>
        </button>
      </div>

      {pipelineStatus && (
        <div 
          role="alert"
          className={`
            p-4 rounded-lg text-sm
            ${pipelineStatus.includes('failed') || pipelineStatus.includes('Error')
              ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
              : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
            }
          `}
        >
          {pipelineStatus}
        </div>
      )}

      <div className="space-y-6">
        {articles.map((article, index) => (
          <SummaryCard key={article.url || index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Summaries;
