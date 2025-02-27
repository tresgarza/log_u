import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import authService, { User } from '../services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch (err: any) {
        setError(err.message || 'Authentication failed');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    }
  };

  return {
    user,
    loading,
    error,
    logout,
  };
}

export default useAuth; 