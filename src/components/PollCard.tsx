'use client';

import { useState, useEffect } from 'react';
import { Poll } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { submitVote, hasUserVoted, subscribeToPoll } from '@/lib/firestore';
import { Clock, Eye, Users } from 'lucide-react';
import ShareButton from './ShareButton';
import toast from 'react-hot-toast';

interface PollCardProps {
  initialPoll: Poll;
}

export default function PollCard({ initialPoll }: PollCardProps) {
  const { user } = useAuth();
  const [poll, setPoll] = useState(initialPoll);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const checkUserVote = async () => {
      const voted = await hasUserVoted(poll.id, user.uid);
      setHasVoted(voted);
    };

    checkUserVote();
  }, [poll.id, user]);

  useEffect(() => {
    const unsubscribe = subscribeToPoll(poll.id, (updatedPoll) => {
      if (updatedPoll) {
        setPoll(updatedPoll);
      }
    });

    return unsubscribe;
  }, [poll.id]);

  const handleVote = async (optionId: string) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    if (hasVoted) {
      toast.error('You have already voted on this poll');
      return;
    }

    if (new Date() > poll.expiresAt) {
      toast.error('This poll has expired');
      return;
    }

    setIsVoting(true);
    setSelectedOption(optionId);

    try {
      await submitVote(poll.id, optionId, user.uid);
      setHasVoted(true);
      toast.success('Vote submitted successfully!');
    } catch {
      toast.error('Failed to submit vote');
      setSelectedOption(null);
    } finally {
      setIsVoting(false);
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const timeLeft = poll.expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const getVotePercentage = (optionVotes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((optionVotes / poll.totalVotes) * 100);
  };

  const isExpired = new Date() > poll.expiresAt;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-200">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {poll.question}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{poll.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{poll.totalVotes} votes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{getTimeRemaining()}</span>
            </div>
          </div>
          
          <ShareButton pollId={poll.id} question={poll.question} />
        </div>
      </div>

      <div className="space-y-3">
        {poll.options.map((option) => {
          const percentage = getVotePercentage(option.votes);
          const isSelected = selectedOption === option.id;
          
          return (
            <div key={option.id} className="relative">
              <button
                onClick={() => handleVote(option.id)}
                disabled={hasVoted || isExpired || isVoting}
                className={`w-full text-left p-4 rounded-lg border transition-all relative overflow-hidden ${
                  hasVoted || isExpired
                    ? 'cursor-not-allowed bg-gray-50 dark:bg-gray-700'
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600'
                } ${
                  isSelected && isVoting
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                {hasVoted && (
                  <div
                    className="absolute left-0 top-0 h-full bg-blue-100 dark:bg-blue-800/50 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <div className="relative flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </span>
                  {hasVoted && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {option.votes} votes
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {percentage}%
                      </span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {isExpired && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">This poll has expired</p>
        </div>
      )}
    </div>
  );
}