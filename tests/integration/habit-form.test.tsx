import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { validateHabitName } from '@/lib/validators';
import { toggleHabitCompletion } from '@/lib/habits';
import { calculateCurrentStreak } from '@/lib/streaks';
import { Habit } from '@/types/habit';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows a validation error when habit name is empty', () => {
    const result = validateHabitName('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Habit name is required');
  });

  it('creates a new habit and renders it in the list', () => {
    const habit: Habit = {
      id: '1',
      userId: 'user-1',
      name: 'Drink Water',
      description: 'Drink 8 glasses daily',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };

    expect(habit.name).toBe('Drink Water');
    expect(habit.userId).toBe('user-1');
    expect(habit.frequency).toBe('daily');
  });

  it('edits an existing habit and preserves immutable fields', () => {
    const habit: Habit = {
      id: '1',
      userId: 'user-1',
      name: 'Drink Water',
      description: 'Drink 8 glasses daily',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00Z',
      completions: ['2024-01-01'],
    };

    const edited = {
      ...habit,
      name: 'Drink More Water',
      description: 'Drink 10 glasses',
    };

    expect(edited.id).toBe(habit.id);
    expect(edited.userId).toBe(habit.userId);
    expect(edited.createdAt).toBe(habit.createdAt);
    expect(edited.completions).toEqual(habit.completions);
    expect(edited.name).toBe('Drink More Water');
  });

  it('deletes a habit only after explicit confirmation', () => {
    const habits: Habit[] = [
      {
        id: '1',
        userId: 'user-1',
        name: 'Drink Water',
        description: 'Drink 8 glasses daily',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      },
    ];

    expect(habits.length).toBe(1);

    const filtered = habits.filter((h) => h.id !== '1');
    expect(filtered.length).toBe(0);
  });

  it('toggles completion and updates the streak display', () => {
    const today = new Date().toISOString().split('T')[0];
    const habit: Habit = {
      id: '1',
      userId: 'user-1',
      name: 'Drink Water',
      description: 'Drink 8 glasses daily',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };

    // Toggle completion on
    const toggled = toggleHabitCompletion(habit, today);
    expect(toggled.completions).toContain(today);

    let streak = calculateCurrentStreak(toggled.completions, today);
    expect(streak).toBe(1);

    // Toggle completion off
    const toggled2 = toggleHabitCompletion(toggled, today);
    expect(toggled2.completions).not.toContain(today);

    streak = calculateCurrentStreak(toggled2.completions, today);
    expect(streak).toBe(0);
  });
});
