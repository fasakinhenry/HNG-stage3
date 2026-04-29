import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signup, login } from '@/lib/auth';
import { getUsers, setUsers, getSession, setSession } from '@/lib/storage';

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

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('submits the signup form and creates a session', () => {
    const result = signup('test@example.com', 'password123');
    expect(result.success).toBe(true);

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session?.email).toBe('test@example.com');

    const users = getUsers();
    expect(users.length).toBe(1);
    expect(users[0].email).toBe('test@example.com');
  });

  it('shows an error for duplicate signup email', () => {
    signup('test@example.com', 'password123');
    const result = signup('test@example.com', 'differentpass');

    expect(result.success).toBe(false);
    expect(result.error).toBe('User already exists');
  });

  it('submits the login form and stores the active session', () => {
    signup('test@example.com', 'password123');
    localStorage.clear();

    const result = login('test@example.com', 'password123');
    expect(result.success).toBe(true);

    const session = getSession();
    expect(session).not.toBeNull();
    expect(session?.email).toBe('test@example.com');
  });

  it('shows an error for invalid login credentials', () => {
    signup('test@example.com', 'password123');

    const result = login('test@example.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email or password');

    const result2 = login('nonexistent@example.com', 'password123');
    expect(result2.success).toBe(false);
    expect(result2.error).toBe('Invalid email or password');
  });
});
