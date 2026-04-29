'use client';

import { STORAGE_KEYS } from './constants';
import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session | null): void {
  if (typeof window === 'undefined') return;
  if (session === null) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } else {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }
}

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}
