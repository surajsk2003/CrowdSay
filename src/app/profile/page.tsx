'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUser, updateUserProfile } from '@/lib/firestore';
import { User } from '@/types';
import UserProfile from '@/components/UserProfile';
import ProfileEdit from '@/components/ProfileEdit';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      router.push('/');
      return;
    }

    const loadUser = async () => {
      try {
        const userData = await getUser(authUser.uid);
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [authUser, router]);

  const handleSaveProfile = async (updates: Partial<User>) => {
    if (!authUser || !user) return;

    try {
      await updateUserProfile(authUser.uid, updates);
      setUser({ ...user, ...updates });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (!authUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSkeleton type="profile" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn't find your profile. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <UserProfile
          user={user}
          isOwnProfile={true}
          onEdit={() => setIsEditing(true)}
        />
        
        {isEditing && (
          <ProfileEdit
            user={user}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </div>
    </div>
  );
}