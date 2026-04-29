'use client';

import { Habit } from '@/types/habit';
import HabitCard from './HabitCard';

interface HabitListProps {
  habits: Habit[];
  onUpdate: () => void;
}

export default function HabitList({ habits, onUpdate }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="text-center py-12 bg-gray-50 rounded-lg"
      >
        <p className="text-gray-500 mb-2">No habits yet.</p>
        <p className="text-gray-400">Create your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
