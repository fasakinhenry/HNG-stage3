'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from './components/shared/SplashScreen';
import { getCurrentSession } from '@/lib/auth';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getCurrentSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }, 1000); // 1 second splash screen

    return () => clearTimeout(timer);
  }, [router]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return null;
}

