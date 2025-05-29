import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Only redirect to auth if no user and not loading
      if (!user && !loading) {
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user
  };
} 