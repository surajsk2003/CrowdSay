'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'poll' | 'list' | 'text' | 'avatar' | 'button' | 'profile';
  count?: number;
  className?: string;
  type?: 'profile';
}

export default function LoadingSkeleton({ variant = 'poll', count = 1, className = '', type }: LoadingSkeletonProps) {
  // Handle legacy type prop
  if (type === 'profile') {
    variant = 'profile';
  }
  const shimmer = {
    hidden: { x: '-100%' },
    visible: {
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut' as const,
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

  const ProfileSkeleton = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end space-x-5 -mt-16">
            <div className="relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
                variants={shimmer}
                initial="hidden"
                animate="visible"
              />
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800" />
            </div>
            <div className="flex-1 min-w-0 pb-2 space-y-3">
              <div className="relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                />
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"
                variants={shimmer}
                initial="hidden"
                animate="visible"
              />
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const skeletonComponents = {
    poll: <PollSkeleton />,
    list: <ListSkeleton />,
    text: <TextSkeleton />,
    avatar: <AvatarSkeleton />,
    button: <ButtonSkeleton />,
    profile: <ProfileSkeleton />,
  };

  return skeletonComponents[variant];
}