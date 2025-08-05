import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const logoutTimer = useRef(null);

  useEffect(() => {
    if (token) {
      // Verify token and get user profile
      fetchUserProfile();
      // Setup auto-logout timer
      setupAutoLogout(token);
    } else {
      setLoading(false);
      clearAutoLogout();
    }
    // Cleanup on unmount
    return () => clearAutoLogout();
  }, [token]);

  // Decode JWT and set timer for expiration
  const setupAutoLogout = (jwtToken) => {
    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      if (payload.exp) {
        const expMs = payload.exp * 1000;
        const nowMs = Date.now();
        const timeoutMs = expMs - nowMs;
        if (timeoutMs > 0) {
          clearAutoLogout();
          logoutTimer.current = setTimeout(() => {
            logout();
            window.location.href = '/login';
          }, timeoutMs);
        } else {
          logout();
          window.location.href = '/login';
        }
      }
    } catch {}
  };

  const clearAutoLogout = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, clear it
        logout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}