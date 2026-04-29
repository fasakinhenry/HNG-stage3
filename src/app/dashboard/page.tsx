'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import HabitForm from '../components/habits/HabitForm';
import HabitList from '../components/habits/HabitList';
import { getCurrentSession, logout } from '@/lib/auth';
import { getHabits } from '@/lib/storage';
import { Habit } from '@/types/habit';

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refresh, setRefresh] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const session = getCurrentSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const allHabits = getHabits();
    const userHabits = allHabits.filter((h) => h.userId === session.userId);
    setHabits(userHabits);
  }, [refresh, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleHabitSuccess = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
              <p className="text-gray-600 mt-1">Build your daily habits</p>
            </div>
            <button
              onClick={handleLogout}
              data-testid="auth-logout-button"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Dashboard Content */}
          <div data-testid="dashboard-page" className="space-y-6">
            <HabitForm onSuccess={handleHabitSuccess} />
            <HabitList habits={habits} onUpdate={handleHabitSuccess} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
