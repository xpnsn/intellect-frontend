import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth-service';
import { User } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(AuthService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for authentication changes
    const checkAuth = () => {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Listen for storage events (in case user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return { user, isAuthenticated, isLoading };
}