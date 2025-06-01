import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Globe, Rss, AlertCircle, CheckCircle, Loader, Settings, Filter } from 'lucide-react';

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
  const [success, setSuccess] = useState<string | null>(null);
  const [addingFeed, setAddingFeed] = useState(false);
  const [deletingFeed, setDeletingFeed] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeed, setNewFeed] = useState<FeedSource>({
    name: '',
    type: 'rss',
    url: '',
    lang: 'en',
    diversity_score: 5.0,
    perspective: '',
    region: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFeed((prevFeed) => ({
      ...prevFeed,
      [name]: name === 'diversity_score' ? parseFloat(value) : value,
    }));
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleAddFeed = async () => {
    clearMessages();
    setAddingFeed(true);
    
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
      setNewFeed({
        name: '',
        type: 'rss',
        url: '',
        lang: 'en',
        diversity_score: 5.0,
        perspective: '',
        region: '',
      });
      setShowAddForm(false);
      setSuccess('Feed added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(`Failed to add feed: ${err.message}`);
    } finally {
      setAddingFeed(false);
    }
  };

  const handleDeleteFeed = async (name: string) => {
    clearMessages();
    setDeletingFeed(name);
    
    try {
      const response = await fetch(`/api/graph/feeds/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      setFeeds(feeds.filter(feed => feed.name !== name));
      setSuccess('Feed deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(`Failed to delete feed: ${err.message}`);
    } finally {
      setDeletingFeed(null);
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
            Loading your feeds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%3E%3Cg%20fill=%22white%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative text-center space-y-4">
          <Settings className="w-12 h-12 text-white/90 mx-auto" />
          <h1 className="text-4xl font-bold text-white">Manage News Feeds</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Configure your news sources to get the most relevant and diverse content
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {(error || success) && (
        <div className="space-y-2">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50/80 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl backdrop-blur-sm">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-800 dark:text-green-200 font-medium">{success}</p>
            </div>
          )}
        </div>
      )}

      {/* Current Feeds Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/2 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-xl" />
        <div className="relative p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rss className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Current Feeds ({feeds.length})
              </h2>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Feed
            </button>
          </div>

          {feeds.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                <Rss className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No feeds configured</h3>
                <p className="text-slate-500 dark:text-slate-400">Add your first news feed to get started</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {feeds.map((feed, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-gradient-to-br from-white/60 via-white/40 to-white/20 dark:from-white/5 dark:via-white/3 dark:to-white/1 backdrop-blur-sm rounded-xl border border-white/30 dark:border-white/10 hover:border-white/50 dark:hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                            {feed.name}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {feed.url}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300">
                          <Filter className="w-3 h-3" />
                          {feed.type.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-blue-100/80 dark:bg-blue-900/30 rounded-md text-xs font-medium text-blue-700 dark:text-blue-300">
                          {feed.lang.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-green-100/80 dark:bg-green-900/30 rounded-md text-xs font-medium text-green-700 dark:text-green-300">
                          Score: {feed.diversity_score}
                        </span>
                        {feed.perspective && (
                          <span className="px-2 py-1 bg-purple-100/80 dark:bg-purple-900/30 rounded-md text-xs font-medium text-purple-700 dark:text-purple-300">
                            {feed.perspective}
                          </span>
                        )}
                        {feed.region && (
                          <span className="px-2 py-1 bg-amber-100/80 dark:bg-amber-900/30 rounded-md text-xs font-medium text-amber-700 dark:text-amber-300">
                            {feed.region}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteFeed(feed.name)}
                      disabled={deletingFeed === feed.name}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:opacity-100 opacity-0"
                    >
                      {deletingFeed === feed.name ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Feed Form */}
      {showAddForm && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/2 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-xl" />
          <div className="relative p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Feed</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Feed Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newFeed.name}
                    onChange={handleInputChange}
                    placeholder="e.g., BBC News"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Feed Type *
                  </label>
                  <select
                    name="type"
                    value={newFeed.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                  >
                    <option value="rss">RSS</option>
                    <option value="atom">Atom</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Feed URL *
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={newFeed.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/feed.xml"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Language *
                  </label>
                  <select
                    name="lang"
                    value={newFeed.lang}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                    <option value="ru">Russian</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Diversity Score (1-10) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    name="diversity_score"
                    value={newFeed.diversity_score}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Perspective
                  </label>
                  <input
                    type="text"
                    name="perspective"
                    value={newFeed.perspective}
                    onChange={handleInputChange}
                    placeholder="e.g., Western Liberal, Conservative"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={newFeed.region}
                    onChange={handleInputChange}
                    placeholder="e.g., North America, Europe/UK"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  onClick={handleAddFeed}
                  disabled={addingFeed}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {addingFeed ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {addingFeed ? 'Adding Feed...' : 'Add Feed'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFeeds;