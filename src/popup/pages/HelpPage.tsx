import React from 'react';
import { FiChevronLeft, FiHelpCircle } from 'react-icons/fi';

const HelpPage: React.FC = () => {
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
            <h1 className="text-lg font-bold text-gray-800">Help & Support</h1>
            <p className="text-sm text-gray-600">Get help and find answers</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-8 mb-4 inline-block">
            <FiHelpCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Help & Support</h2>
          <p className="text-gray-500">Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;