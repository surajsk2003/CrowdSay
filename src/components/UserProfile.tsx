'use client';

import { useState } from 'react';
import { User, UserStats } from '@/types';
import { motion } from 'framer-motion';
import { Edit3, MapPin, Calendar, Trophy, TrendingUp, Target, Flame } from 'lucide-react';

interface UserProfileProps {
  user: User;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export default function UserProfile({ user, isOwnProfile = false, onEdit }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'activity'>('overview');

  const getAvatarUrl = (user: User) => {
    if (user.avatar) return user.avatar;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const StatCard = ({ icon: Icon, label, value, color = 'blue' }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end space-x-5 -mt-16">
            <div className="relative">
              <img
                src={getAvatarUrl(user)}
                alt={user.displayName || 'User avatar'}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white"
              />
              {user.stats.streak > 0 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1">
                  <Flame className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.displayName || 'Anonymous User'}
                  </h1>
                  {!user.isAnonymous && (
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {user.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(user.joinedAt)}</span>
                    </div>
                  </div>
                </div>
                {isOwnProfile && (
                  <button
                    onClick={onEdit}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
              {user.bio && (
                <p className="mt-3 text-gray-700 dark:text-gray-300">{user.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'stats', label: 'Statistics' },
              { key: 'activity', label: 'Activity' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  icon={Trophy}
                  label="Reputation"
                  value={user.reputation}
                  color="yellow"
                />
                <StatCard
                  icon={Target}
                  label="Polls Created"
                  value={user.stats.totalPollsCreated}
                  color="green"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Total Votes"
                  value={user.stats.totalVotes}
                  color="blue"
                />
                <StatCard
                  icon={Flame}
                  label="Current Streak"
                  value={`${user.stats.streak} days`}
                  color="orange"
                />
              </div>

              {/* Top Categories */}
              {user.stats.topCategories.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Top Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.stats.topCategories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Engagement Metrics
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Average Engagement</span>
                        <span className="text-gray-900 dark:text-white">{user.stats.averageEngagement}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${user.stats.averageEngagement}%` }}
                        ></div>
                      </div>
                    </div>
                    <StatCard
                      icon={TrendingUp}
                      label="Total Views"
                      value={user.stats.totalViews.toLocaleString()}
                      color="purple"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Activity Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Polls Created</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user.stats.totalPollsCreated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">Votes Cast</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user.stats.totalVotes}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 dark:text-gray-400">Active Streak</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {user.stats.streak} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 dark:text-gray-400">
                Activity timeline coming soon...
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}