'use client';

import { User, Session } from '@/types/auth';
import { getUsers, setUsers, getSession, setSession } from './storage';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function signup(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    return { success: false, error: 'User already exists' };
  }

  const newUser: User = {
    id: generateId(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  setUsers(users);

  // Create session
  setSession({
    userId: newUser.id,
    email: newUser.email,
  });

  return { success: true };
}

export function login(email: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  setSession({
    userId: user.id,
    email: user.email,
  });

  return { success: true };
}

export function logout(): void {
  setSession(null);
}

export function getCurrentSession(): Session | null {
  return getSession();
}
