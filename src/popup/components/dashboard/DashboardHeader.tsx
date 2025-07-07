import React from 'react';
import { FiUser, FiLogOut, FiBarChart2, FiArrowLeft, FiSettings } from 'react-icons/fi';

interface DashboardHeaderProps {
  username: string;
  displayName?: string;
  onRefresh: () => void;
  onLogout: () => void;
  onAnalytics: () => void;
  onSettings: () => void;
  showBack?: boolean;
  onBack?: () => void;
  isAnalytics?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  username,
  displayName,
  onRefresh,
  onLogout,
  onAnalytics,
  onSettings,
  showBack = false,
  onBack,
  isAnalytics = false,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        {showBack && onBack ? (
          <button
            className="text-gray-500 hover:text-blue-600"
            title="Back"
            onClick={onBack}
          >
            <FiArrowLeft size={22} />
          </button>
        ) : (
          <button
            className="text-gray-500 hover:text-blue-600"
            title="Profile"
          >
            <FiUser size={22} />
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-800">
          {displayName || username}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        {!isAnalytics && (
          <button
            onClick={onAnalytics}
            className="text-gray-500 hover:text-blue-600 p-1"
            title="Analytics"
          >
            <FiBarChart2 size={22} />
          </button>
        )}
        <button
          onClick={onRefresh}
          className="text-gray-500 hover:text-blue-600 p-1"
          title="Refresh"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          onClick={onSettings}
          className="text-gray-500 hover:text-blue-600 p-1"
          title="Settings"
        >
          <FiSettings size={22} />
        </button>
        <button
          onClick={onLogout}
          className="text-red-500 hover:text-red-700 p-1"
          title="Logout"
        >
          <FiLogOut size={22} />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;