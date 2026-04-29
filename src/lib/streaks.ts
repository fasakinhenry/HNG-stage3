export function calculateCurrentStreak(
  completions: string[],
  today?: string
): number {
  if (completions.length === 0) {
    return 0;
  }

  // Get today's date in YYYY-MM-DD format
  const todayDate = today || new Date().toISOString().split('T')[0];

  // Remove duplicates and sort
  const uniqueSorted = Array.from(new Set(completions)).sort();

  // Check if today is completed
  if (!uniqueSorted.includes(todayDate)) {
    return 0;
  }

  // Count consecutive days backwards from today
  let streak = 0;
  let currentDate = new Date(todayDate);

  for (const completionDate of uniqueSorted.reverse()) {
    const completion = new Date(completionDate);
    const daysDiff = Math.floor(
      (currentDate.getTime() - completion.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
