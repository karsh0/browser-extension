import React from 'react';
import { FiBell } from 'react-icons/fi';

const NotificationPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="text-center">
        <div className="bg-gray-100 rounded-full p-8 mb-4 inline-block">
          <FiBell className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Notifications</h2>
        <p className="text-gray-500">Coming Soon</p>
      </div>
    </div>
  );
};

export default NotificationPage;