import React, { useState } from 'react';
import PendingReceived from './PendingReceived';
import PendingSent from './PendingSent';
import IgnoredRequests from './IgnoredRequests';

const SUBTABS = [
  { key: 'received', label: 'Received' },
  { key: 'sent', label: 'Sent' },
  { key: 'ignored', label: 'Ignored' },
];

const PendingRequests: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('received');

  return (
    <div className="flex flex-col h-full">
      <div className="flex space-x-2 mb-2">
        {SUBTABS.map(tab => (
          <button
            key={tab.key}
            className={`px-3 py-1 rounded font-medium transition ${
              activeSubTab === tab.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
            }`}
            onClick={() => setActiveSubTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeSubTab === 'received' && <PendingReceived />}
        {activeSubTab === 'sent' && <PendingSent />}
        {activeSubTab === 'ignored' && <IgnoredRequests />}
      </div>
    </div>
  );
};

export default PendingRequests;