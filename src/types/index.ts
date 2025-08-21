export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  creatorId: string;
  createdAt: Date;
  expiresAt: Date;
  category: string;
  status: 'active' | 'closed' | 'pending';
  views: number;
  totalVotes: number;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Vote {
  id: string;
  pollId: string;
  userId: string;
  optionId: string;
  timestamp: Date;
}

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  isAnonymous: boolean;
  reputation: number;
  createdPolls: string[];
  votedPolls: string[];
}