'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'poll' | 'list' | 'text' | 'avatar' | 'button';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({ variant = 'poll', count = 1, className = '' }: LoadingSkeletonProps) {
  const shimmer = {
    hidden: { x: '-100%' },
    visible: {
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  };

  const PollSkeleton = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
          variants={shimmer}
          initial="hidden"
          animate="visible"
        />
        
        {/* Poll title skeleton */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        
        {/* Stats skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        
        {/* Options skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <PollSkeleton key={index} />
      ))}
    </div>
  );

  const TextSkeleton = () => (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
        variants={shimmer}
        initial="hidden"
        animate="visible"
      />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );

  const AvatarSkeleton = () => (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
        variants={shimmer}
        initial="hidden"
        animate="visible"
      />
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
  );

  const ButtonSkeleton = () => (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
        variants={shimmer}
        initial="hidden"
        animate="visible"
      />
      <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  );

  const skeletonComponents = {
    poll: <PollSkeleton />,
    list: <ListSkeleton />,
    text: <TextSkeleton />,
    avatar: <AvatarSkeleton />,
    button: <ButtonSkeleton />,
  };

  return skeletonComponents[variant];
}