'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PollList from '@/components/PollList';
import CreatePoll from '@/components/CreatePoll';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePollCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trending Polls
          </h1>
          <p className="text-gray-600">
            Vote on what matters to you and see what others think
          </p>
        </div>

        <CreatePoll onPollCreated={handlePollCreated} />
        <PollList key={refreshKey} />
      </main>
    </div>
  );
}
