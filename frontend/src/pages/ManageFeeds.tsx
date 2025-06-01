import React, { useEffect, useState } from 'react';

interface FeedSource {
  name: string;
  type: string;
  url: string;
  lang: string;
  diversity_score: number;
  perspective: string;
  region: string;
}

const ManageFeeds: React.FC = () => {
  const [feeds, setFeeds] = useState<FeedSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newFeed, setNewFeed] = useState<FeedSource>({
    name: '',
    type: '',
    url: '',
    lang: '',
    diversity_score: 0,
    perspective: '',
    region: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFeed((prevFeed) => ({
      ...prevFeed,
      [name]: name === 'diversity_score' ? parseFloat(value) : value,
    }));
  };

  const handleAddFeed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/graph/feeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeed),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const addedFeed = await response.json();
      setFeeds([...feeds, addedFeed.source]);
      setNewFeed({ // Reset form
        name: '',
        type: '',
        url: '',
        lang: '',
        diversity_score: 0,
        perspective: '',
        region: '',
      });
    } catch (err: any) {
      setError(`Failed to add feed: ${err.message}`);
      console.error('Error adding feed:', err);
    }
  };

  const handleDeleteFeed = async (name: string) => {
    try {
      const response = await fetch(`/api/graph/feeds/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Remove the deleted feed from the local state
      setFeeds(feeds.filter(feed => feed.name !== name));
    } catch (err: any) {
      setError(`Failed to delete feed: ${err.message}`);
      console.error('Error deleting feed:', err);
    }
  };


  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch('/api/graph/feeds');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFeeds(data.sources || []);
      } catch (err) {
        setError('Failed to fetch feeds.');
        console.error('Error fetching feeds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  if (loading) {
    return <div>Loading feeds...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage News Feeds</h1>
      <div>
        <h2 className="text-xl font-semibold mb-2">Current Feeds</h2>
        {feeds.length === 0 ? (
          <p>No feeds configured.</p>
        ) : (
          <ul className="list-disc pl-5">
            {feeds.map((feed, index) => (
              <li key={index} className="mb-2 flex items-center justify-between">
                <span>
                  <strong>{feed.name}</strong> ({feed.url})
                </span>
                <button
                  onClick={() => handleDeleteFeed(feed.name)}
                  className="ml-4 p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Feed</h2>
        <form onSubmit={handleAddFeed} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={newFeed.name}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Type (e.g., rss)"
            name="type"
            value={newFeed.type}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="url"
            placeholder="URL"
            name="url"
            value={newFeed.url}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Language (e.g., en)"
            name="lang"
            value={newFeed.lang}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            step="0.1"
            placeholder="Diversity Score (e.g., 7.0)"
            name="diversity_score"
            value={newFeed.diversity_score}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Perspective (e.g., Western Liberal)"
            name="perspective"
            value={newFeed.perspective}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Region (e.g., Europe/UK)"
            name="region"
            value={newFeed.region}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Feed
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageFeeds;
