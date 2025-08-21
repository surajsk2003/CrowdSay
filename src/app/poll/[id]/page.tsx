'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import PollCard from '@/components/PollCard';
import PollAnalytics from '@/components/PollAnalytics';
import { getPoll, incrementPollViews } from '@/lib/firestore';
import { Poll } from '@/types';
import Link from 'next/link';
import { ArrowLeft, BarChart3 } from 'lucide-react';

export default function PollPage() {
  const params = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!params.id || typeof params.id !== 'string') return;

      try {
        setLoading(true);
        const fetchedPoll = await getPoll(params.id);
        
        if (fetchedPoll) {
          setPoll(fetchedPoll);
          // Increment view count
          await incrementPollViews(params.id);
        } else {
          setError('Poll not found');
        }
      } catch (err) {
        console.error('Error fetching poll:', err);
        setError('Failed to load poll');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Poll not found'}
            </h1>
            <p className="text-gray-600 mb-8">
              The poll you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all polls</span>
          </Link>
          
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>{showAnalytics ? 'Hide Analytics' : 'View Analytics'}</span>
          </button>
        </div>

        {showAnalytics ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {poll.question}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Poll Analytics & Detailed Results
              </p>
            </div>
            <PollAnalytics poll={poll} />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <PollCard initialPoll={poll} />
          </div>
        )}
      </main>
    </div>
  );
}