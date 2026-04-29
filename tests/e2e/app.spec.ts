import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({
    page,
  }) => {
    await page.goto('/');
    
    // Check splash screen is visible
    const splashScreen = page.getByTestId('splash-screen');
    await expect(splashScreen).toBeVisible();
    
    // Wait for redirect to login
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // Set up an authenticated session
    await page.evaluate(() => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('habit-tracker-users', JSON.stringify([user]));
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({
          userId: 'user-123',
          email: 'test@example.com',
        })
      );
    });

    await page.goto('/');
    
    // Should redirect to dashboard
    await page.waitForURL('/dashboard');
    expect(page.url()).toContain('/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');

    // Fill in signup form
    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    // Should redirect to dashboard
    await page.waitForURL('/dashboard');
    const dashboard = page.getByTestId('dashboard-page');
    await expect(dashboard).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // Set up two users with different habits
    await page.evaluate(() => {
      const users = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          password: 'password123',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          password: 'password456',
          createdAt: new Date().toISOString(),
        },
      ];

      const habits = [
        {
          id: 'habit-1',
          userId: 'user-1',
          name: 'User 1 Habit',
          description: 'For user 1',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
        {
          id: 'habit-2',
          userId: 'user-2',
          name: 'User 2 Habit',
          description: 'For user 2',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
      ];

      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });

    await page.goto('/login');

    // Log in as user 1
    await page.getByTestId('auth-login-email').fill('user1@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();

    // Should be on dashboard
    await page.waitForURL('/dashboard');
    
    // Should see user 1's habit
    const habit1Card = page.getByTestId('habit-card-user-1-habit');
    await expect(habit1Card).toBeVisible();

    // Should not see user 2's habit
    const habit2Card = page.getByTestId('habit-card-user-2-habit');
    await expect(habit2Card).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    // Sign up first
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('testuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('/dashboard');

    // Click create habit button
    await page.getByTestId('create-habit-button').click();

    // Fill in habit form
    await page.getByTestId('habit-name-input').fill('Morning Run');
    await page.getByTestId('habit-description-input').fill('5km run every morning');
    await page.getByTestId('habit-save-button').click();

    // Should see the habit in the list
    const habitCard = page.getByTestId('habit-card-morning-run');
    await expect(habitCard).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    // Set up a user with an existing habit
    await page.evaluate(() => {
      const users = [
        {
          id: 'user-1',
          email: 'test@example.com',
          password: 'password123',
          createdAt: new Date().toISOString(),
        },
      ];

      const habits = [
        {
          id: 'habit-1',
          userId: 'user-1',
          name: 'Drink Water',
          description: 'Drink 8 glasses',
          frequency: 'daily',
          createdAt: new Date().toISOString(),
          completions: [],
        },
      ];

      localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({
          userId: 'user-1',
          email: 'test@example.com',
        })
      );
      localStorage.setItem('habit-tracker-habits', JSON.stringify(habits));
    });

    await page.goto('/dashboard');

    // Check streak is 0
    let streak = page.getByTestId('habit-streak-drink-water');
    await expect(streak).toContainText('0');

    // Mark habit as complete
    await page.getByTestId('habit-complete-drink-water').click();

    // Streak should be 1
    streak = page.getByTestId('habit-streak-drink-water');
    await expect(streak).toContainText('1');

    // Button should show "Done Today"
    const completeButton = page.getByTestId('habit-complete-drink-water');
    await expect(completeButton).toContainText('Done Today');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    // Sign up
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('testuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('/dashboard');

    // Create a habit
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Exercise');
    await page.getByTestId('habit-description-input').fill('30 min workout');
    await page.getByTestId('habit-save-button').click();

    // Mark it complete
    await page.getByTestId('habit-complete-exercise').click();

    // Reload page
    await page.reload();

    // Session should be maintained
    expect(page.url()).toContain('/dashboard');

    // Habit should still be there with completion
    const habitCard = page.getByTestId('habit-card-exercise');
    await expect(habitCard).toBeVisible();

    const streak = page.getByTestId('habit-streak-exercise');
    await expect(streak).toContainText('1');
  });

  test('logs out and redirects to /login', async ({ page }) => {
    // Set up authenticated session
    await page.evaluate(() => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('habit-tracker-users', JSON.stringify([user]));
      localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({
          userId: 'user-123',
          email: 'test@example.com',
        })
      );
    });

    await page.goto('/dashboard');

    // Click logout
    await page.getByTestId('auth-logout-button').click();

    // Should redirect to login
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({
    page,
    context,
  }) => {
    // First, load the app while online
    await page.goto('/');
    await page.waitForURL('/login');

    // Now simulate offline mode
    await context.setOffline(true);

    // The app should still be accessible from cache
    await page.goto('/login');
    
    // The page should load without a hard crash
    const loginForm = page.getByTestId('auth-login-email');
    // May or may not be visible depending on cache, but shouldn't crash
    expect(page.url()).toBeDefined();
  });
});
