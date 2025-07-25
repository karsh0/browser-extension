import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import PrivacySettings from '../components/settings/PrivacySettings';

const PrivacyPage: React.FC = () => {
  const handleBack = () => {
    window.location.href = '#/more';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiChevronLeft size={20} className="mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">Privacy & Security</h1>
            <p className="text-sm text-gray-600">Control who can see your information</p>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        <PrivacySettings onBack={handleBack} />
      </div>
    </div>
  );
};

export default PrivacyPage;