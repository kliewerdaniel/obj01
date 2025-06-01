import React, { useEffect, useState } from 'react';

interface Article {
  title: string;
  source: string;
  summary: string;
  url: string;
  published: string;
}

const SummaryCard = ({ article }: { article: Article }) => {
  return (
    <div className="summary-card" style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
      <h2>{article.title}</h2>
      <p><strong>Source:</strong> {article.source}</p>
      <p><strong>Summary:</strong> {article.summary}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
      <p><em>Published:</em> {new Date(article.published).toLocaleString()}</p>
    </div>
  );
};

const Summaries = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/graph/')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        setArticles(data.data);  // assumes response is { data: Article[] }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Latest News Summaries</h1>
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        articles.map((article, index) => (
          <SummaryCard key={index} article={article} />
        ))
      )}
    </div>
  );
};

export default Summaries;