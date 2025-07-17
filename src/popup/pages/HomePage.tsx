import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FriendsProvider } from '../context/FriendsContext';
import { WelcomeScreen } from '../components/welcome';
import { DashboardHeader } from '../components/dashboard';
import FriendsTabs from '../components/dashboard/FriendsTabs';
import AnalyticsPanel from '../components/analytics/AnalyticsPanel';
import SettingsPanel from '../components/settings/SettingsPanel';
import LeaderboardPanel from '../components/leaderboard/LeaderboardPanel';
import { flushAnalytics } from '../../services/api';

const HomePage: React.FC = () => {
  const { user, loading, logout } = useAuth();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <WelcomeScreen />;
  }

  return (
    <FriendsProvider>
      <div className="min-h-[600px] w-[400px] bg-white flex flex-col h-[600px]">
        {/* Header is fixed at the top */}
        <div className="sticky top-0 z-10 bg-white p-6 pb-2">
          <DashboardHeader
            username={user.username}
            displayName={
              showSettings
                ? "Privacy Settings"
                : showAnalytics
                ? "Analytics"
                : showLeaderboard
                ? "Leaderboard"
                : user.displayName
            }
            onRefresh={handleRefresh}
            onLogout={handleLogout}
            onAnalytics={() => {
              resetViews();
              setShowAnalytics(true);
            }}
            onSettings={() => {
              resetViews();
              setShowSettings(true);
            }}
            onLeaderboard={() => {
              resetViews();
              setShowLeaderboard(true);
            }}
            showBack={showAnalytics || showSettings || showLeaderboard}
            onBack={resetViews}
            isAnalytics={showAnalytics}
            isLeaderboard={showLeaderboard}
          />
        </div>
        {/* Main content scrolls inside the popup */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {showSettings ? (
            <SettingsPanel onBack={resetViews} />
          ) : showAnalytics ? (
            <AnalyticsPanel />
          ) : showLeaderboard ? (
            <LeaderboardPanel onBack={resetViews} />
          ) : (
            <FriendsTabs />
          )}
        </div>
      </div>
    </FriendsProvider>
  );
};

export default HomePage;