'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createPoll } from '@/lib/firestore';
import { Plus, X, Calendar, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreatePollProps {
  onPollCreated?: () => void;
}

const categories = [
  'politics',
  'technology', 
  'entertainment',
  'sports',
  'lifestyle',
  'other'
];

export default function CreatePoll({ onPollCreated }: CreatePollProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    category: 'other',
    duration: 24, // hours
  });

  const handleAddOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, '']
      });
    }
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        options: newOptions
      });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to create a poll');
      return;
    }

    const validOptions = formData.options.filter(option => option.trim() !== '');
    
    if (formData.question.trim() === '') {
      toast.error('Please enter a question');
      return;
    }

    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    setIsSubmitting(true);

    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + formData.duration);

      const pollData = {
        question: formData.question.trim(),
        options: validOptions.map((option, index) => ({
          id: `option_${index}`,
          label: option.trim(),
          votes: 0
        })),
        creatorId: user.uid,
        createdAt: new Date(),
        expiresAt,
        category: formData.category,
        status: 'active' as const,
      };

      await createPoll(pollData);
      
      toast.success('Poll created successfully!');
      
      // Reset form
      setFormData({
        question: '',
        options: ['', ''],
        category: 'other',
        duration: 24,
      });
      
      setIsOpen(false);
      onPollCreated?.();
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Poll</span>
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Poll</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Question
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="What would you like to ask?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={280}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.question.length}/280 characters
              </p>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Options
              </label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={100}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                {formData.options.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Option</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Duration (hours)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={72}>3 days</option>
                  <option value={168}>1 week</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Poll'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}