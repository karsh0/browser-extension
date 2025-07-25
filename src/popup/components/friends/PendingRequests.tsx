import React, { useState } from 'react';
import { FiInbox, FiSend, FiEyeOff, FiUsers } from 'react-icons/fi';
import PendingReceived from './PendingReceived';
import PendingSent from './PendingSent';
import IgnoredRequests from './IgnoredRequests';

interface SubTab {
  key: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const PendingRequests: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('received');

  const subTabs: SubTab[] = [
    {
      key: 'received',
      label: 'Received',
      icon: <FiInbox size={16} />,
      component: <PendingReceived />
    },
    {
      key: 'sent',
      label: 'Sent',
      icon: <FiSend size={16} />,
      component: <PendingSent />
    },
    {
      key: 'ignored',
      label: 'Ignored',
      icon: <FiEyeOff size={16} />,
      component: <IgnoredRequests />
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Sub-navigation */}
      <div className="mb-4">
        <div className="flex items-center mb-3">
          <FiUsers className="text-gray-600 mr-2" size={20} />
          <h3 className="font-semibold text-gray-800">Friend Requests</h3>
        </div>
        
        <div className="flex space-x-1 bg-gray-50 rounded-lg p-1">
          {subTabs.map(tab => (
            <button
              key={tab.key}
              className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeSubTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveSubTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {subTabs.find(tab => tab.key === activeSubTab)?.component}
      </div>
    </div>
  );
};

export default PendingRequests;