'use client';

import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'error' | 'network' | 'empty' | 'search';
  className?: string;
}

export default function ErrorState({
  title,
  message,
  actionLabel = 'Try Again',
  onAction,
  variant = 'error',
  className = ''
}: ErrorStateProps) {
  const variants = {
    error: {
      icon: AlertCircle,
      title: title || 'Something went wrong',
      message: message || 'We encountered an unexpected error. Please try again.',
      iconColor: 'text-red-500 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    network: {
      icon: WifiOff,
      title: title || 'Connection Error',
      message: message || 'Please check your internet connection and try again.',
      iconColor: 'text-orange-500 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    empty: {
      icon: AlertCircle,
      title: title || 'No Data Found',
      message: message || 'There\'s nothing to show here yet.',
      iconColor: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800'
    },
    search: {
      icon: AlertCircle,
      title: title || 'No Results Found',
      message: message || 'Try adjusting your search criteria.',
      iconColor: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3, type: 'spring' }}
        className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mb-6`}
      >
        <Icon className={`w-8 h-8 ${config.iconColor}`} />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
      >
        {config.title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 dark:text-gray-400 max-w-sm mb-6"
      >
        {config.message}
      </motion.p>
      
      {onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onAction}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors transform hover:scale-105 duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
}

// Specialized components for common use cases
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      variant="network"
      actionLabel="Retry"
      onAction={onRetry}
    />
  );
}

export function EmptyState({ 
  title, 
  message, 
  actionLabel, 
  onAction 
}: { 
  title?: string; 
  message?: string; 
  actionLabel?: string; 
  onAction?: () => void; 
}) {
  return (
    <ErrorState
      variant="empty"
      title={title}
      message={message}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
}

export function SearchEmptyState({ query, onClear }: { query: string; onClear?: () => void }) {
  return (
    <ErrorState
      variant="search"
      title="No polls found"
      message={`No results found for "${query}". Try different keywords.`}
      actionLabel="Clear Search"
      onAction={onClear}
    />
  );
}