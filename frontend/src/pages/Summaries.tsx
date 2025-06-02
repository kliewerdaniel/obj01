import React, { useEffect, useState, useCallback } from 'react';
import SummaryCard, { type Article } from '../components/SummaryCard';

// Mock data structure based on the context (keeping this for reference, but using API fetch)
// const mockNewsData = [
//   {
//     id: 1,
//     title: "Technology Advances in AI Development",
//     source: "Tech Daily",
//     date: "2025-06-01",
//     summary: "Recent breakthroughs in artificial intelligence are reshaping how we approach complex problem-solving across various industries.",
//     link: "#"
//   },
//   {
//     id: 2,
//     title: "Global Climate Summit Reaches Key Agreements",
//     source: "Environmental News",
//     date: "2025-05-31",
//     summary: "World leaders have agreed on new initiatives to combat climate change, including ambitious carbon reduction targets for the next decade.",
//     link: "#"
//   },
//   {
//     id: 3,
//     title: "Economic Markets Show Steady Growth",
//     source: "Financial Times",
//     date: "2025-05-30",
//     summary: "Markets continue to demonstrate resilience with steady growth patterns observed across multiple sectors this quarter.",
//     link: "#"
//   }
// ];

const LoadingState = () => (
  <div className="loading-state">
    <p>Loading news summaries...</p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="error-state">
    <h2>Something went wrong</h2>
    <p role="alert">{message}</p>
  </div>
);

const NoDataState = () => (
  <div className="no-data-state">
    <p>No stories available yet</p>
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
      // Assuming data.data is an array of Article objects
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
    <div className="container">


      <main className="content-area">
        <div className="pipeline-controls">
          <button
            onClick={runPipeline}
            disabled={pipelineRunning}
            className={`refresh-btn ${pipelineRunning ? 'running' : ''}`}
          >
            {pipelineRunning ? 'Updating...' : 'Refresh Stories'}
          </button>
          {pipelineStatus && (
            <div className={`pipeline-status ${pipelineStatus.includes('failed') || pipelineStatus.includes('Error') ? 'error' : 'success'}`}>
              {pipelineStatus}
            </div>
          )}
        </div>

        <div className="summaries-grid">
          {articles.map((article, index) => (
            // Assuming SummaryCard component accepts 'article' prop
            <SummaryCard key={article.url || index} article={article} />
          ))}
        </div>
      </main>

      <footer className="page-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </footer>

      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          color: #333;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e1e5e9;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #2c3e50;
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #6c757d;
          margin: 0;
          font-weight: 400;
        }

        .content-area {
          margin-bottom: 3rem;
        }

        .pipeline-controls {
          display: flex;
          align-items: center;
          justify-content: flex-end; /* Align to the right */
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .refresh-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background-color 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .refresh-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .refresh-btn:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }

        .pipeline-status {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .pipeline-status.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .pipeline-status.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }


        .summaries-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }

        /* SummaryCard styles are assumed to be in SummaryCard.tsx */
        /* .summary-card { ... } */

        .page-footer {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid #e1e5e9;
          font-size: 0.875rem;
          color: #6c757d;
        }

        .loading-state, .error-state, .no-data-state {
          text-align: center;
          padding: 4rem 0;
          color: #6c757d;
        }

        .error-state h2 {
          color: #dc3545;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .error-state p {
           color: #dc3545;
        }


        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 1.5rem 1rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .summaries-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          /* .summary-card {
            padding: 1.25rem;
          } */

          /* .card-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          } */
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.75rem;
          }

          /* .summary-card {
            padding: 1rem;
          } */
        }
      `}</style>
    </div>
  );
};

export default Summaries;
