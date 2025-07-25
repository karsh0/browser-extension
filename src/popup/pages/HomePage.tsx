import React, { useState } from 'react';
import { FiUsers, FiActivity, FiUserPlus, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendsContext';
import { FriendsProvider } from '../context/FriendsContext';
import { WelcomeScreen } from '../components/welcome';
import FriendsList from '../components/friends/FriendsList';
import { flushAnalytics } from '../../services/api';

const HomePage: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const { friends, loading: friendsLoading } = useFriends();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '#/';
  };

  const handleRefresh = async () => {
    if (!user) return;
    await flushAnalytics(user.token);
    await new Promise<void>((resolve) => {
      chrome.runtime.sendMessage({ type: "PUBLISH_ACTIVE_TAB" }, () => resolve());
    });
    window.location.reload();
  };

  const resetViews = () => {
    setShowAnalytics(false);
    setShowSettings(false);
    setShowLeaderboard(false);
  };

  if (loading || friendsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <span className="text-gray-500">Loading friends...</span>
      </div>
    );
  }

  if (!user) {
    return <WelcomeScreen />;
  }

  const onlineFriends = friends.filter(f => f.isOnline);
  const activeBrowsingFriends = onlineFriends.filter(f => f.activeTab?.url);
  const totalFriends = friends.length;

  return (
    <FriendsProvider>
      <div className="h-full flex flex-col">
        {/* Always show compact header with stats */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiActivity className="text-blue-600" size={18} />
              <h1 className="text-lg font-bold text-gray-800">Live Activity</h1>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{onlineFriends.length} online</span>
              </div>
              {totalFriends > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{totalFriends} total</span>
                </>
              )}
            </div>
          </div>
          
          {activeBrowsingFriends.length > 0 && (
            <div className="mt-1">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {activeBrowsingFriends.length} friend{activeBrowsingFriends.length !== 1 ? 's' : ''} browsing
              </span>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          {/* Online Friends Activity */}
          {onlineFriends.length > 0 ? (
            <div className="space-y-3">
              <FriendsList homeView={true} />
              
              {totalFriends > onlineFriends.length && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      {totalFriends - onlineFriends.length} more friend{totalFriends - onlineFriends.length !== 1 ? 's' : ''} offline
                    </p>
                    <a 
                      href="#/friends"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <FiUsers size={14} />
                      <span>View all friends</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Main Empty State */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-8 mb-6">
                  <FiActivity className="w-12 h-12 text-blue-500" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No friends online right now
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm">
                  When your friends come online, you'll see their browsing activity here in real-time.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 w-full max-w-xs">
                  
                  {totalFriends > 0 && (
                    <a 
                      href="#/friends"
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      <FiUsers size={18} />
                      <span>View All Friends ({totalFriends})</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">{totalFriends}</div>
                    <div className="text-xs text-gray-600">
                      {totalFriends === 1 ? 'Friend' : 'Friends'}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <div className="text-lg font-bold text-green-600">{onlineFriends.length}</div>
                    <div className="text-xs text-gray-600">Online Now</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </FriendsProvider>
  );
};

export default HomePage;