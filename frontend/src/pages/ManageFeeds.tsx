import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Globe2, RssIcon, AlertCircle, CheckCircle, Loader2, Grid3X3, Filter, ExternalLink } from 'lucide-react';

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
    setNewFeed(prev => ({
      ...prev,
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
        headers: { 'Content-Type': 'application/json' },
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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setFeeds(data.sources || []);
      } catch (err: any) {
        setError('Failed to fetch feeds.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-violet-500/20 dark:bg-violet-400/20 blur-2xl animate-pulse" />
            <div className="relative rounded-full bg-gradient-to-br from-violet-500 to-blue-500 p-4">
              <Grid3X3 className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white animate-pulse">
            Loading feed sources...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20 bg-gradient-to-br from-violet-500 to-blue-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%3E%3Cg%20fill=%22white%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        
        {/* Content */}
        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <Grid3X3 className="w-12 h-12 text-white/90 mx-auto" />
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Manage News Sources
            </h1>
            <p className="text-lg text-blue-100 font-light max-w-2xl mx-auto">
              Configure your news sources to get the most relevant and diverse content
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 hover:text-violet-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5" />
            Add News Source
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {(error || success) && (
        <div className="max-w-3xl mx-auto px-4">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-300 text-sm font-medium">{success}</p>
            </div>
          )}
        </div>
      )}

      {/* Current Feeds Grid */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <RssIcon className="w-6 h-6 text-violet-500 dark:text-violet-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Active Sources ({feeds.length})
              </h2>
            </div>
          </div>

          {feeds.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <RssIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  No feeds configured
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Add your first news source to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {feeds.map((feed, index) => (
                <div
                  key={index}
                  className={`
                    group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-950/50
                    animate-in fade-in slide-in-from-bottom duration-700
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-violet-50 dark:bg-violet-950/50 rounded-lg">
                            <Globe2 className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {feed.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <ExternalLink className="w-4 h-4" />
                              <span className="truncate">{feed.url}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                            <Filter className="w-3.5 h-3.5" />
                            {feed.type.toUpperCase()}
                          </span>
                          <span className="px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/50 rounded-lg text-xs font-medium text-blue-700 dark:text-blue-300">
                            {feed.lang.toUpperCase()}
                          </span>
                          <span className="px-2.5 py-1.5 bg-green-50 dark:bg-green-950/50 rounded-lg text-xs font-medium text-green-700 dark:text-green-300">
                            Score: {feed.diversity_score}
                          </span>
                          {feed.perspective && (
                            <span className="px-2.5 py-1.5 bg-purple-50 dark:bg-purple-950/50 rounded-lg text-xs font-medium text-purple-700 dark:text-purple-300">
                              {feed.perspective}
                            </span>
                          )}
                          {feed.region && (
                            <span className="px-2.5 py-1.5 bg-orange-50 dark:bg-orange-950/50 rounded-lg text-xs font-medium text-orange-700 dark:text-orange-300">
                              {feed.region}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteFeed(feed.name)}
                        disabled={deletingFeed === feed.name}
                        className={`
                          p-2 rounded-lg transition-all duration-200
                          ${deletingFeed === feed.name
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-500 dark:hover:text-red-400'
                          }
                        `}
                        aria-label={`Delete ${feed.name}`}
                      >
                        {deletingFeed === feed.name ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Feed Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-500/75 dark:bg-gray-950/75 backdrop-blur-sm transition-opacity"
              onClick={() => setShowAddForm(false)}
            />

            {/* Modal panel */}
            <div className="relative transform rounded-2xl bg-white dark:bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add News Source
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Feed Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newFeed.name}
                        onChange={handleInputChange}
                        placeholder="e.g., BBC News"
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Feed Type *
                      </label>
                      <select
                        name="type"
                        value={newFeed.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent"
                        required
                      >
                        <option value="rss">RSS</option>
                        <option value="atom">Atom</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Feed URL *
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={newFeed.url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/feed.xml"
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Language *
                      </label>
                      <select
                        name="lang"
                        value={newFeed.lang}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent"
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Perspective
                      </label>
                      <input
                        type="text"
                        name="perspective"
                        value={newFeed.perspective}
                        onChange={handleInputChange}
                        placeholder="e.g., Western Liberal, Conservative"
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Region
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={newFeed.region}
                        onChange={handleInputChange}
                        placeholder="e.g., North America, Europe"
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddFeed}
                    disabled={addingFeed}
                    className={`
                      inline-flex items-center gap-2 px-6 py-2.5 font-medium rounded-lg
                      transition-all duration-200
                      ${addingFeed
                        ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-400 cursor-not-allowed'
                        : 'bg-violet-500 text-white hover:bg-violet-600 dark:hover:bg-violet-400 dark:hover:text-gray-900'
                      }
                    `}
                  >
                    {addingFeed ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add Feed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFeeds;
