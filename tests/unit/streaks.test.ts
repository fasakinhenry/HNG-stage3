import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    expect(calculateCurrentStreak([yesterday], today)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

    expect(calculateCurrentStreak([today], today)).toBe(1);
    expect(calculateCurrentStreak([today, yesterday], today)).toBe(2);
    expect(calculateCurrentStreak([today, yesterday, twoDaysAgo], today)).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    expect(calculateCurrentStreak([today, today, yesterday], today)).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    const today = new Date().toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

    expect(calculateCurrentStreak([today, twoDaysAgo], today)).toBe(1);
  });
});
