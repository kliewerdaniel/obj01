import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Globe2, RssIcon, AlertCircle, CheckCircle, Loader2, Grid3X3, Filter, ExternalLink, X, Settings, TrendingUp } from 'lucide-react';

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
        <div className="space-y-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-2xl animate-pulse scale-150" />
            <div className="relative rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-6 shadow-2xl">
              <Settings className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              Loading News Sources
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Configuring your personalized feed...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section with Enhanced Visuals */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 px-4 sm:px-6 lg:px-8 pt-16 pb-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%3E%3Cg%20fill=%22white%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/svg%3E')]" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Manage News Sources
            </h1>
            <p className="text-xl text-blue-100 font-light max-w-2xl mx-auto leading-relaxed">
              Curate your perfect news experience with diverse sources and perspectives
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowAddForm(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 hover:text-blue-700 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 hover:scale-105"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add News Source
            </button>
            
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{feeds.length} sources configured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages with Enhanced Design */}
      {(error || success) && (
        <div className="max-w-4xl mx-auto px-4">
          {error && (
            <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-2xl backdrop-blur-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900/50 rounded-2xl backdrop-blur-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-green-700 dark:text-green-300 font-medium">{success}</p>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Feeds Grid */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <RssIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Active Sources
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {feeds.length} {feeds.length === 1 ? 'source' : 'sources'} providing diverse perspectives
                </p>
              </div>
            </div>
          </div>

          {feeds.length === 0 ? (
            <div className="text-center py-16 space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto">
                <RssIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  No Sources Configured
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Add your first news source to start building your personalized news experience
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Source
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {feeds.map((feed, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  
                  {/* Content */}
                  <div className="relative p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Globe2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {feed.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate text-xs">{feed.url}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteFeed(feed.name)}
                        disabled={deletingFeed === feed.name}
                        className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                          deletingFeed === feed.name
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-500 dark:hover:text-red-400 hover:scale-110'
                        }`}
                        aria-label={`Delete ${feed.name}`}
                      >
                        {deletingFeed === feed.name ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300">
                        <Filter className="w-3 h-3" />
                        {feed.type.toUpperCase()}
                      </span>
                      <span className="px-3 py-1.5 bg-green-50 dark:bg-green-950/50 rounded-full text-xs font-semibold text-green-700 dark:text-green-300">
                        {feed.lang.toUpperCase()}
                      </span>
                      <span className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/50 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300">
                        Score: {feed.diversity_score}
                      </span>
                    </div>

                    {/* Additional Info */}
                    {(feed.perspective || feed.region) && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        {feed.perspective && (
                          <span className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950/50 rounded-full text-xs font-medium text-orange-700 dark:text-orange-300">
                            {feed.perspective}
                          </span>
                        )}
                        {feed.region && (
                          <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-full text-xs font-medium text-indigo-700 dark:text-indigo-300">
                            {feed.region}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Add Feed Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            {/* Enhanced Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
              onClick={() => setShowAddForm(false)}
            />

            {/* Enhanced Modal */}
            <div className="relative transform rounded-3xl bg-white dark:bg-gray-900 px-6 pb-6 pt-6 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="space-y-8">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add News Source
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Expand your news diversity with a new source
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Enhanced Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Feed Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newFeed.name}
                        onChange={handleInputChange}
                        placeholder="e.g., BBC News"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Feed Type *
                      </label>
                      <select
                        name="type"
                        value={newFeed.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="rss">RSS</option>
                        <option value="atom">Atom</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Feed URL *
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={newFeed.url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/feed.xml"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Language *
                      </label>
                      <select
                        name="lang"
                        value={newFeed.lang}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
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
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
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
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Perspective
                      </label>
                      <input
                        type="text"
                        name="perspective"
                        value={newFeed.perspective}
                        onChange={handleInputChange}
                        placeholder="e.g., Liberal, Conservative, Centrist"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Region
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={newFeed.region}
                        onChange={handleInputChange}
                        placeholder="e.g., North America, Europe, Asia"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddFeed}
                    disabled={addingFeed}
                    className={`inline-flex items-center gap-3 px-8 py-3 font-semibold rounded-xl transition-all duration-200 ${
                      addingFeed
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    {addingFeed ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding Source...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Add Source</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ManageFeeds;