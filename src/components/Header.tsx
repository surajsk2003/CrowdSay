'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Vote, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
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
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Vote className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CrowdSay</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                
                <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
                  <User className="h-4 w-4" />
                  <span>
                    {user.isAnonymous ? 'Guest User' : user.email}
                  </span>
                </div>
              </>
            )}
            
            <ThemeToggle />
            
            <button
              onClick={handleAuth}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md transform hover:scale-105 duration-200"
            >
              {user ? (
                <>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In as Guest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}