import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
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
import { Poll, Vote, User } from '@/types';

// Collections
export const COLLECTIONS = {
  POLLS: 'polls',
  VOTES: 'votes', 
  USERS: 'users',
} as const;

// Poll operations
export async function createPoll(pollData: Omit<Poll, 'id' | 'views' | 'totalVotes'>) {
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

export async function getPolls(category?: string, sortBy: 'trending' | 'recent' = 'trending') {
  try {
    let q = query(
      collection(db, COLLECTIONS.POLLS),
      where('status', '==', 'active')
    );

    if (category && category !== 'all') {
      q = query(q, where('category', '==', category));
    }

    if (sortBy === 'trending') {
      q = query(q, orderBy('views', 'desc'), limit(20));
    } else {
      q = query(q, orderBy('createdAt', 'desc'), limit(20));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as Poll[];
  } catch (error) {
    console.error('Error getting polls:', error);
    throw error;
  }
}

export async function getPoll(pollId: string) {
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