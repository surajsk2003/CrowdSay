'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Vote } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Header() {
  const { user, signInAnonymous, logout } = useAuth();

  const handleAuth = async () => {
    if (user) {
      await logout();
      toast.success('Signed out successfully');
    } else {
      try {
        await signInAnonymous();
        toast.success('Signed in as guest');
      } catch {
        toast.error('Failed to sign in');
      }
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">CrowdSay</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>
                  {user.isAnonymous ? 'Guest User' : user.email}
                </span>
              </div>
            )}
            
            <button
              onClick={handleAuth}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {user ? (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span>Sign In as Guest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}