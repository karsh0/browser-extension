import React, { useState } from 'react';
import { FiUsers, FiClock, FiSearch } from 'react-icons/fi';
import FriendsList from '../components/friends/FriendsList';
import PendingRequests from '../components/friends/PendingRequests';
import SearchFriends from '../components/friends/SearchFriends';

interface TabConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const tabs: TabConfig[] = [
    {
      key: 'all',
      label: 'All Friends',
      icon: <FiUsers size={18} />,
      component: <FriendsList homeView={false} />
    },
    {
      key: 'requests',
      label: 'Requests',
      icon: <FiClock size={18} />,
      component: <PendingRequests />
    },
    {
      key: 'search',
      label: 'Search',
      icon: <FiSearch size={18} />,
      component: <SearchFriends />
    }
  ];

  return (
    <div className="h-full flex flex-col p-4">
      {/* Page Header */}
      {/* <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800">Friends</h1>
        <p className="text-sm text-gray-600">Connect and manage your friends</p>
      </div> */}

      {/* Compact Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {tabs.find(tab => tab.key === activeTab)?.component}
      </div>
    </div>
  );
};

export default FriendsPage;