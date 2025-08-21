import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Poll } from '@/types';

const isDemoMode = process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'demo-api-key' || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Demo data
const demoPolls: Poll[] = [
  {
    id: 'demo-1',
    question: 'Which programming language should I learn next?',
    options: [
      { id: 'option_0', label: 'TypeScript', votes: 42 },
      { id: 'option_1', label: 'Python', votes: 38 },
      { id: 'option_2', label: 'Rust', votes: 25 },
      { id: 'option_3', label: 'Go', votes: 31 }
    ],
    creatorId: 'demo-user',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
    category: 'technology',
    status: 'active',
    views: 1250,
    totalVotes: 136
  },
  {
    id: 'demo-2',
    question: 'What\'s your favorite way to spend a weekend?',
    options: [
      { id: 'option_0', label: 'Outdoor activities', votes: 28 },
      { id: 'option_1', label: 'Reading books', votes: 15 },
      { id: 'option_2', label: 'Watching movies', votes: 32 },
      { id: 'option_3', label: 'Spending time with family', votes: 45 }
    ],
    creatorId: 'demo-user',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000), // 19 hours from now
    category: 'lifestyle',
    status: 'active',
    views: 890,
    totalVotes: 120
  },
  {
    id: 'demo-3',
    question: 'Should remote work become the new standard?',
    options: [
      { id: 'option_0', label: 'Yes, completely remote', votes: 55 },
      { id: 'option_1', label: 'Hybrid model is better', votes: 67 },
      { id: 'option_2', label: 'No, office work is important', votes: 23 }
    ],
    creatorId: 'demo-user',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours from now
    category: 'other',
    status: 'active',
    views: 2150,
    totalVotes: 145
  }
];

const demoVotes: { pollId: string; userId: string; optionId: string }[] = [];

// Collections
export const COLLECTIONS = {
  POLLS: 'polls',
  VOTES: 'votes', 
  USERS: 'users',
} as const;

// Poll operations
export async function createPoll(pollData: Omit<Poll, 'id' | 'views' | 'totalVotes'>) {
  if (isDemoMode) {
    const newPoll: Poll = {
      ...pollData,
      id: `demo-${Date.now()}`,
      views: 0,
      totalVotes: 0,
    };
    demoPolls.unshift(newPoll);
    return newPoll.id;
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.POLLS), {
      ...pollData,
      views: 0,
      totalVotes: 0,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(pollData.expiresAt),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
}

export async function getPolls(
  category?: string, 
  sortBy: 'trending' | 'recent' = 'trending', 
  searchQuery?: string,
  page: number = 1,
  pageSize: number = 20
) {
  if (isDemoMode) {
    let filteredPolls = [...demoPolls];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPolls = filteredPolls.filter(poll => 
        poll.question.toLowerCase().includes(query) ||
        poll.options.some(option => option.label.toLowerCase().includes(query)) ||
        poll.category.toLowerCase().includes(query)
      );
    }
    
    if (category && category !== 'all') {
      filteredPolls = filteredPolls.filter(poll => poll.category === category);
    }
    
    if (sortBy === 'trending') {
      filteredPolls.sort((a, b) => b.views - a.views);
    } else {
      filteredPolls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPolls.slice(startIndex, endIndex);
  }

  try {
    let q = query(
      collection(db, COLLECTIONS.POLLS),
      where('status', '==', 'active')
    );

    if (category && category !== 'all') {
      q = query(q, where('category', '==', category));
    }

    if (sortBy === 'trending') {
      q = query(q, orderBy('views', 'desc'), limit(pageSize * page));
    } else {
      q = query(q, orderBy('createdAt', 'desc'), limit(pageSize * page));
    }

    const querySnapshot = await getDocs(q);
    let allPolls = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as Poll[];

    // Client-side search filtering for Firebase
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      allPolls = allPolls.filter(poll => 
        poll.question.toLowerCase().includes(query) ||
        poll.options.some(option => option.label.toLowerCase().includes(query)) ||
        poll.category.toLowerCase().includes(query)
      );
    }

    // Return only the current page
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allPolls.slice(startIndex, endIndex);
  } catch (error) {
    console.error('Error getting polls:', error);
    throw error;
  }
}

export async function getPoll(pollId: string) {
  if (isDemoMode) {
    return demoPolls.find(poll => poll.id === pollId) || null;
  }

  try {
    const docRef = doc(db, COLLECTIONS.POLLS, pollId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        expiresAt: data.expiresAt?.toDate(),
      } as Poll;
    }
    return null;
  } catch (error) {
    console.error('Error getting poll:', error);
    throw error;
  }
}

export async function incrementPollViews(pollId: string) {
  if (isDemoMode) {
    const poll = demoPolls.find(p => p.id === pollId);
    if (poll) {
      poll.views += 1;
    }
    return;
  }

  try {
    const pollRef = doc(db, COLLECTIONS.POLLS, pollId);
    await updateDoc(pollRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

// Vote operations
export async function submitVote(pollId: string, optionId: string, userId: string) {
  if (isDemoMode) {
    // Check if user already voted
    const existingVote = demoVotes.find(vote => vote.pollId === pollId && vote.userId === userId);
    if (existingVote) {
      throw new Error('User has already voted on this poll');
    }

    // Add vote
    demoVotes.push({ pollId, optionId, userId });

    // Update poll option vote count
    const poll = demoPolls.find(p => p.id === pollId);
    if (poll) {
      poll.options = poll.options.map(option => 
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      );
      poll.totalVotes += 1;
    }
    return;
  }

  try {
    // Check if user already voted
    const existingVoteQuery = query(
      collection(db, COLLECTIONS.VOTES),
      where('pollId', '==', pollId),
      where('userId', '==', userId)
    );
    const existingVotes = await getDocs(existingVoteQuery);
    
    if (!existingVotes.empty) {
      throw new Error('User has already voted on this poll');
    }

    // Add vote
    await addDoc(collection(db, COLLECTIONS.VOTES), {
      pollId,
      optionId,
      userId,
      timestamp: serverTimestamp(),
    });

    // Update poll option vote count
    const pollRef = doc(db, COLLECTIONS.POLLS, pollId);
    const pollDoc = await getDoc(pollRef);
    
    if (pollDoc.exists()) {
      const pollData = pollDoc.data() as Poll;
      const updatedOptions = pollData.options.map(option => 
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      );
      
      await updateDoc(pollRef, {
        options: updatedOptions,
        totalVotes: increment(1)
      });
    }
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}

export async function hasUserVoted(pollId: string, userId: string) {
  if (isDemoMode) {
    return demoVotes.some(vote => vote.pollId === pollId && vote.userId === userId);
  }

  try {
    const voteQuery = query(
      collection(db, COLLECTIONS.VOTES),
      where('pollId', '==', pollId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(voteQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user vote:', error);
    return false;
  }
}

// Real-time subscriptions
export function subscribeToPoll(pollId: string, callback: (poll: Poll | null) => void) {
  if (isDemoMode) {
    const poll = demoPolls.find(p => p.id === pollId);
    callback(poll || null);
    // Return a no-op unsubscribe function
    return () => {};
  }

  const pollRef = doc(db, COLLECTIONS.POLLS, pollId);
  
  return onSnapshot(pollRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const poll = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        expiresAt: data.expiresAt?.toDate(),
      } as Poll;
      callback(poll);
    } else {
      callback(null);
    }
  });
}