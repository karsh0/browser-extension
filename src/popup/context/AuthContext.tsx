import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  displayName?: string;
  token: string;
  onlinePrivacy?: string;
  lastOnlinePrivacy?: string;
  tabPrivacy?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await chrome.storage.local.get('user');
        if (userData.user) {
          setUser(JSON.parse(userData.user));
          chrome.runtime.sendMessage({ type: 'POPUP_OPENED' });
        }
      } catch (error) {
        console.error('Failed to load user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    chrome.storage.local.set({ user: JSON.stringify(userData) });
    chrome.runtime.sendMessage({ type: 'LOGIN_SUCCESS'});
  };

  const logout = () => {
    setUser(null);
    chrome.storage.local.remove('user');
    chrome.runtime.sendMessage({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
