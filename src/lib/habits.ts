import { Habit } from '@/types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = [...habit.completions];
  const index = completions.indexOf(date);

  if (index >= 0) {
    completions.splice(index, 1);
  } else {
    completions.push(date);
  }

  // Remove duplicates and sort
  const unique = Array.from(new Set(completions)).sort();

  return {
    ...habit,
    completions: unique,
  };
}
