'use client';

import { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';
import { getHabits, setHabits } from '@/lib/storage';
import { getCurrentSession } from '@/lib/auth';

interface HabitFormProps {
  habit?: Habit;
  onSuccess: () => void;
}

export default function HabitForm({ habit, onSuccess }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const session = getCurrentSession();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error || 'Invalid habit name');
      return;
    }

    if (!session) {
      setError('Not authenticated');
      return;
    }

    const habits = getHabits();
    const now = new Date().toISOString();

    if (habit) {
      // Edit mode
      const index = habits.findIndex((h) => h.id === habit.id);
      if (index >= 0) {
        habits[index] = {
          ...habits[index],
          name: validation.value,
          description,
        };
      }
    } else {
      // Create mode
      const newHabit: Habit = {
        id: Math.random().toString(36).substr(2, 9),
        userId: session.userId,
        name: validation.value,
        description,
        frequency: 'daily',
        createdAt: now,
        completions: [],
      };
      habits.push(newHabit);
    }

    setHabits(habits);
    setName('');
    setDescription('');
    setIsOpen(false);
    onSuccess();
  };

  if (!habit && isOpen) {
    return (
      <form
        onSubmit={handleSubmit}
        data-testid="habit-form"
        className="bg-white p-4 rounded-lg shadow mb-4"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label
              htmlFor="habit-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Habit Name
            </label>
            <input
              id="habit-name"
              data-testid="habit-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Drink Water"
            />
          </div>

          <div>
            <label
              htmlFor="habit-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="habit-description"
              data-testid="habit-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Why do you want to build this habit?"
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="habit-frequency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Frequency
            </label>
            <select
              id="habit-frequency"
              data-testid="habit-frequency-select"
              defaultValue="daily"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              data-testid="habit-save-button"
              className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Save Habit
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setName('');
                setDescription('');
                setError('');
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }

  if (habit) {
    return (
      <form
        onSubmit={handleSubmit}
        data-testid="habit-form"
        className="bg-white p-4 rounded-lg shadow mb-4"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label
              htmlFor="habit-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Habit Name
            </label>
            <input
              id="habit-name"
              data-testid="habit-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="habit-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="habit-description"
              data-testid="habit-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              data-testid="habit-save-button"
              className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Update Habit
            </button>
            <button
              type="button"
              onClick={() => onSuccess()}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      data-testid="create-habit-button"
      className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition-colors mb-6"
    >
      + Create New Habit
    </button>
  );
}
