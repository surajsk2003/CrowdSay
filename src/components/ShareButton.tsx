'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  pollId: string;
  question: string;
}

export default function ShareButton({ pollId, question }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/poll/${pollId}`;
  const shareText = `Vote on: "${question}"`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CrowdSay Poll',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled sharing or error occurred
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20 min-w-48">
            <h3 className="font-medium text-gray-900 mb-3">Share this poll</h3>
            
            <div className="space-y-2">
              <button
                onClick={shareToTwitter}
                className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Twitter className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Twitter</span>
              </button>
              
              <button
                onClick={shareToFacebook}
                className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Facebook</span>
              </button>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-600" />
                )}
                <span className="text-sm">Copy link</span>
              </button>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">Share URL:</div>
              <div className="text-xs text-gray-700 break-all bg-gray-50 p-2 rounded mt-1">
                {shareUrl}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}