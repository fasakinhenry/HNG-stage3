'use client';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-blue-800"
    >
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Habit Tracker</h1>
        <p className="text-xl text-blue-100">Build your daily habits</p>
      </div>
    </div>
  );
}
