'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion } from '@/lib/habits';
import { getHabits, setHabits } from '@/lib/storage';
import HabitForm from './HabitForm';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
}

export default function HabitCard({ habit, onUpdate }: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleCompletion = () => {
    const habits = getHabits();
    const index = habits.findIndex((h) => h.id === habit.id);
    if (index >= 0) {
      const updated = toggleHabitCompletion(habits[index], today);
      habits[index] = updated;
      setHabits(habits);
      onUpdate();
    }
  };

  const handleDelete = () => {
    const habits = getHabits();
    const filtered = habits.filter((h) => h.id !== habit.id);
    setHabits(filtered);
    onUpdate();
  };

  if (isEditing) {
    return (
      <HabitForm
        habit={habit}
        onSuccess={() => {
          setIsEditing(false);
          onUpdate();
        }}
      />
    );
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              data-testid={`habit-streak-${slug}`}
              className="text-2xl font-bold text-blue-600"
            >
              {streak}
            </span>
            <span className="text-sm text-gray-600">day streak</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleToggleCompletion}
          data-testid={`habit-complete-${slug}`}
          className={`flex-1 py-2 rounded-md font-medium transition-colors ${
            isCompletedToday
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isCompletedToday ? '✓ Done Today' : 'Mark Complete'}
        </button>

        <button
          onClick={() => setIsEditing(true)}
          data-testid={`habit-edit-${slug}`}
          className="px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
        >
          Edit
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          data-testid={`habit-delete-${slug}`}
          className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
        >
          Delete
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-gray-700 mb-3">
            Are you sure you want to delete this habit? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              data-testid="confirm-delete-button"
              className="flex-1 bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
