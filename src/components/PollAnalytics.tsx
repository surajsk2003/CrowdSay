'use client';

import { useState, useEffect } from 'react';
import { Poll } from '@/types';
import { BarChart3, Users, TrendingUp, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface PollAnalyticsProps {
  poll: Poll;
}

export default function PollAnalytics({ poll }: PollAnalyticsProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const timeRemaining = poll.expiresAt.getTime() - now.getTime();
      
      if (timeRemaining <= 0) {
        setTimeLeft('Expired');
        return;
      }
      
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [poll.expiresAt]);

  const totalVotes = poll.totalVotes;
  const maxVotes = Math.max(...poll.options.map(option => option.votes));
  
  const getVotePercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const getEngagementRate = () => {
    if (poll.views === 0) return 0;
    return Math.round((totalVotes / poll.views) * 100);
  };

  const isExpired = new Date() > poll.expiresAt;

  const stats = [
    {
      label: 'Total Votes',
      value: totalVotes.toLocaleString(),
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Views',
      value: poll.views.toLocaleString(),
      icon: Eye,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Engagement',
      value: `${getEngagementRate()}%`,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: 'Time Left',
      value: timeLeft,
      icon: Clock,
      color: isExpired ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400',
      bgColor: isExpired ? 'bg-red-100 dark:bg-red-900/30' : 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Results
          </h3>
        </div>

        <div className="space-y-4">
          {poll.options.map((option, index) => {
            const percentage = getVotePercentage(option.votes);
            const isWinning = option.votes === maxVotes && maxVotes > 0;
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                    {isWinning && totalVotes > 0 && (
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                        Leading
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {percentage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {option.votes.toLocaleString()} votes
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-full rounded-full ${
                      isWinning
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {totalVotes === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No votes yet. Be the first to vote!
          </div>
        )}
      </div>

      {/* Poll Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Poll Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Created:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {poll.createdAt.toLocaleDateString()} at {poll.createdAt.toLocaleTimeString()}
            </span>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Expires:</span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {poll.expiresAt.toLocaleDateString()} at {poll.expiresAt.toLocaleTimeString()}
            </span>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Category:</span>
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              {poll.category.charAt(0).toUpperCase() + poll.category.slice(1)}
            </span>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs ${
              isExpired 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            }`}>
              {isExpired ? 'Expired' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}