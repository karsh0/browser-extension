import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FriendsProvider } from '../context/FriendsContext';
import { WelcomeScreen } from '../components/welcome';
import { DashboardHeader } from '../components/dashboard';
import FriendsTabs from '../components/dashboard/FriendsTabs';
import AnalyticsPanel from '../components/analytics/AnalyticsPanel';
import SettingsPanel from '../components/settings/SettingsPanel';

const HomePage: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '#/';
  };

  const handleRefresh = () => {
    window.location.reload();
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
                ? "Privacy\nSettings"
                : showAnalytics
                ? "Analytics"
                : user.displayName
            }
            onRefresh={handleRefresh}
            onLogout={handleLogout}
            onAnalytics={() => setShowAnalytics(true)}
            onSettings={() => setShowSettings(true)}
            showBack={showAnalytics || showSettings}
            onBack={() => {
              setShowAnalytics(false);
              setShowSettings(false);
            }}
            isAnalytics={showAnalytics}
          />
        </div>
        {/* Main content scrolls inside the popup */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {showSettings ? (
            <SettingsPanel onBack={() => setShowSettings(false)} />
          ) : showAnalytics ? (
            <AnalyticsPanel />
          ) : (
            <FriendsTabs />
          )}
        </div>
      </div>
    </FriendsProvider>
  );
};

export default HomePage;