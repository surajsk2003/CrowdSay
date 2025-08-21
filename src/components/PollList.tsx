'use client';

import { useState, useEffect } from 'react';
import { Poll } from '@/types';
import { getPolls } from '@/lib/firestore';
import PollCard from './PollCard';
import SearchBar from './SearchBar';
import { Filter, TrendingUp, Clock } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'politics', label: 'Politics' },
  { id: 'technology', label: 'Technology' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'other', label: 'Other' },
];

export default function PollList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'trending' | 'recent'>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const fetchedPolls = await getPolls(
          selectedCategory === 'all' ? undefined : selectedCategory,
          sortBy,
          searchQuery
        );
        setPolls(fetchedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [selectedCategory, sortBy, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex justify-center">
        <SearchBar 
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search polls by question, options, or category..."
        />
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-800 dark:text-blue-200">
            {loading ? 'Searching...' : `Found ${polls.length} poll${polls.length !== 1 ? 's' : ''} for "${searchQuery}"`}
            {!loading && polls.length > 0 && (
              <button
                onClick={handleClearSearch}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setSortBy('trending')}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                  sortBy === 'trending'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                  sortBy === 'recent'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Recent</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Polls Grid */}
      {polls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard key={poll.id} initialPoll={poll} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 mb-2">
            {searchQuery ? 'No polls found for your search' : 'No polls found'}
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {searchQuery 
              ? 'Try searching with different keywords'
              : selectedCategory !== 'all' 
              ? `No polls in the ${categories.find(c => c.id === selectedCategory)?.label} category`
              : 'Be the first to create a poll!'
            }
          </p>
        </div>
      )}
    </div>
  );
}