import React, { useState } from 'react';
import FriendsList from '../friends/FriendsList';
import PendingRequests from '../friends/PendingRequests';
import SearchFriends from '../friends/SearchFriends';

const TABS = [
  { key: 'all', label: 'All Friends' },
  { key: 'pending', label: 'Requests' },
  { key: 'search', label: 'Search' },
];

const FriendsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="flex flex-col h-full">
      {/* Tab Buttons */}
      <div className="flex space-x-1 mb-3 bg-gray-100 rounded-lg p-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'all' && <FriendsList />}
        {activeTab === 'pending' && <PendingRequests />}
        {activeTab === 'search' && <SearchFriends />}
      </div>
    </div>
  );
};

export default FriendsTabs;