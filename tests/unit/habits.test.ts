import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'user-1',
    name: 'Drink Water',
    description: 'Drink 8 glasses',
    frequency: 'daily',
    createdAt: '2024-01-01T00:00:00Z',
    completions: [],
  };

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2024-01-01');
    expect(result.completions).toContain('2024-01-01');
  });

  it('removes a completion date when the date already exists', () => {
    const habitWithCompletion = {
      ...mockHabit,
      completions: ['2024-01-01'],
    };
    const result = toggleHabitCompletion(habitWithCompletion, '2024-01-01');
    expect(result.completions).not.toContain('2024-01-01');
  });

  it('does not mutate the original habit object', () => {
    const originalCompletions = [...mockHabit.completions];
    toggleHabitCompletion(mockHabit, '2024-01-01');
    expect(mockHabit.completions).toEqual(originalCompletions);
  });

  it('does not return duplicate completion dates', () => {
    const habitWithDuplicates = {
      ...mockHabit,
      completions: ['2024-01-01', '2024-01-01'],
    };
    const result = toggleHabitCompletion(habitWithDuplicates, '2024-01-02');
    expect(result.completions.length).toBe(2);
    expect(result.completions.sort()).toEqual(['2024-01-01', '2024-01-02']);
  });
});
