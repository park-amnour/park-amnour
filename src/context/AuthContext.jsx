import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { insforge } from '../lib/insforge';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastActivity = useRef(Date.now());
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const handleActivity = () => {
      lastActivity.current = Date.now();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    const initAuth = async () => {
      try {
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
          if (error.message?.includes('No refresh token') || error.errorCode === 'no_refresh_token') {
            setUser(null);
          } else if (error.message?.includes('CSRF') || error.statusCode === 403) {
            await insforge.auth.signOut();
            setUser(null);
          }
        }
      } catch (error) {
        // Silent catch
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Session Heartbeat: Keep session alive during activity
    const refreshInterval = setInterval(async () => {
      if (!userRef.current) return;

      // Only refresh if user was active in the last 15 minutes
      // OR if we strictly need to refresh the token
      const wasActiveRecently = (Date.now() - lastActivity.current) < 15 * 60 * 1000;

      try {
        const { data, error } = await insforge.auth.refreshSession();
        if (data?.user) {
          setUser(data.user);
        } else if (error) {
          // If active, be VERY lenient with errors
          if (wasActiveRecently) {
            console.warn('Session refresh failed but user is active. Retrying later...', error.message);
            return;
          }

          // If inactive and session is dead, clear user
          if (error.message?.includes('No refresh token') || error.errorCode === 'no_refresh_token' || error.statusCode === 401) {
             setUser(null);
             await insforge.auth.signOut();
          }
        }
      } catch (err) {
        console.error('Session heartbeat error:', err);
      }
    }, 4 * 60 * 1000); // Check every 4 minutes

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      clearInterval(refreshInterval);
    };
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
