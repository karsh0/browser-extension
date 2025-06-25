import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchFriendsWithStatus } from '../../services/api';

interface Friend {
  id: string;
  username: string;
  displayName?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface FriendsContextType {
  friends: Friend[];
  loading: boolean;
  refresh: () => void;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFriends = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchFriendsWithStatus(user.token);
      setFriends(res.data || []);
    } catch {
      setFriends([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFriends();
  }, [user]);

  return (
    <FriendsContext.Provider value={{ friends, loading, refresh: loadFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const ctx = useContext(FriendsContext);
  if (!ctx) throw new Error('useFriends must be used within FriendsProvider');
  return ctx;
};