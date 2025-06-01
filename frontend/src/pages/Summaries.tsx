import React, { useEffect, useState, useCallback } from 'react';
import SummaryCard, { type Article } from '../components/SummaryCard';
import { RefreshCw, BookOpen } from 'lucide-react';

// UI States
const LoadingMessage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
      <p className="text-slate-600 text-lg font-medium" role="status" aria-live="polite">
        Curating your stories...
      </p>
    </div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-red-50 px-4">
    <div className="text-center space-y-4 max-w-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-red-600 text-2xl">⚠</span>
      </div>
      <h2 className="text-xl font-semibold text-slate-800">Something went wrong</h2>
      <p className="text-red-600 text-base" role="alert">{message}</p>
    </div>
  </div>
);

const NoDataMessage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50 px-4">
    <div className="text-center space-y-6 max-w-md">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
        <BookOpen className="w-8 h-8 text-amber-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800">No stories yet</h2>
        <p className="text-slate-600 text-base" role="status" aria-live="polite">
          Check back soon for fresh content, or try regenerating stories.
        </p>
      </div>
    </div>
  </div>
);

const Summaries: React.FC = () => {
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

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;
  if (!articles.length) return <NoDataMessage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%3E%3Cg%20fill=%22white%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 text-center space-y-8">
          <div className="pt-4">
            <button
              onClick={runPipeline}
              disabled={pipelineRunning}
              aria-busy={pipelineRunning}
              aria-disabled={pipelineRunning}
              className={`group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${
                pipelineRunning 
                  ? 'bg-white/20 text-white/60 cursor-not-allowed backdrop-blur-sm'
                  : 'bg-white text-slate-800 hover:bg-gray-50 shadow-white/20 hover:shadow-white/30'
              } focus:outline-none focus:ring-4 focus:ring-white/30`}
            >
              <RefreshCw className={`w-5 h-5 ${pipelineRunning ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
              <span>{pipelineRunning ? 'Curating Stories...' : 'Refresh Stories'}</span>
              {!pipelineRunning && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Status Alert */}
      {pipelineStatus && (
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div
            role="alert"
            className={`p-6 rounded-2xl border backdrop-blur-sm shadow-lg ${
              pipelineStatus.startsWith('Pipeline failed') || pipelineStatus.startsWith('Error')
                ? 'bg-red-50/80 border-red-200 text-red-800'
                : 'bg-green-50/80 border-green-200 text-green-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                pipelineStatus.startsWith('Pipeline failed') || pipelineStatus.startsWith('Error')
                  ? 'bg-red-400'
                  : 'bg-green-400'
              }`} />
              <span className="font-medium">{pipelineStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center mb-16">
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto" />
        </div>
        {articles.map((article, index) => (
          <div
            key={index} // Using index as a temporary key fix
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <SummaryCard article={article} />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-20 py-12 space-y-6">
        <button
          onClick={runPipeline}
          disabled={pipelineRunning}
          className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
            pipelineRunning
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${pipelineRunning ? 'animate-spin' : ''}`} />
          {pipelineRunning ? 'Updating...' : 'Get Latest Stories'}
        </button>
      </div>
    </div>
  );
};

export default Summaries;
