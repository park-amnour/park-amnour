import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { insforge } from '../lib/insforge';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Only attempt to check session if we see ANY auth-related keys in storage
        // This prevents the 401 network hit on page load for new visitors
        const hasPotentialSession = Object.keys(localStorage).some(k => 
          k.toLowerCase().includes('auth-token') || 
          k.toLowerCase().includes('insforge') ||
          k.toLowerCase().includes('sb-')
        );

        if (!hasPotentialSession) {
          setLoading(false);
          return;
        }

        const { data, error } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
        } else if (error) {
          // Silent failure if no session is available
          if (error.message?.includes('No refresh token') || error.errorCode === 'no_refresh_token') {
            setUser(null);
          } else if (error.message?.includes('CSRF') || error.statusCode === 403) {
            await insforge.auth.signOut();
            setUser(null);
          }
        }
      } catch (error) {
        // Silently catch unexpected errors on init
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Periodically refresh session to avoid 401s/403s
    const refreshInterval = setInterval(async () => {
      // ONLY refresh if we have a user in state
      if (!userRef.current) return;

      // Also check for potential session keys in localStorage before attempting refresh
      const hasPotentialSession = Object.keys(localStorage).some(k => 
        k.toLowerCase().includes('auth-token') || 
        k.toLowerCase().includes('insforge') ||
        k.toLowerCase().includes('sb-')
      );

      if (!hasPotentialSession) {
        // If no session keys are found, and we have a user in state, it might be stale.
        // Clear user and stop refreshing.
        setUser(null);
        return;
      }

      try {
        const { data, error } = await insforge.auth.refreshSession();
        if (data?.user) {
          setUser(data.user);
        } else if (error) {
          if (error.statusCode === 401 || error.statusCode === 403 || error.message?.includes('CSRF')) {
            setUser(null);
            await insforge.auth.signOut();
          }
        }
      } catch (err) {
        console.error('Session refresh failed:', err);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Update local state after successful login
      if (data?.user) {
        setUser(data.user);
      }
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await insforge.auth.signOut();
      setUser(null); // Clear local state after logout
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return { login: async () => ({ success: false }), user: null, loading: true };
  }
  return context;
};
