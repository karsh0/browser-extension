import React from 'react';
import { FiUser, FiEdit3, FiCamera, FiMail, FiCalendar, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

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
            <h1 className="text-lg font-bold text-gray-800">Profile Settings</h1>
            <p className="text-sm text-gray-600">Manage your profile information</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Current Profile Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {user?.displayName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors">
              <FiCamera size={14} />
            </button>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {user?.displayName || user?.username}
          </h2>
          <p className="text-gray-600">@{user?.username}</p>
        </div>

        {/* Coming Soon Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Editing Features</h3>
          
          {[
            {
              icon: <FiEdit3 size={20} />,
              title: 'Edit Display Name',
              description: 'Change how your name appears to other users'
            },
            {
              icon: <FiCamera size={20} />,
              title: 'Upload Avatar',
              description: 'Upload a profile picture or choose from presets'
            },
            {
              icon: <FiUser size={20} />,
              title: 'Bio & Status',
              description: 'Add a bio and custom status message'
            },
            {
              icon: <FiMail size={20} />,
              title: 'Contact Information',
              description: 'Update email and social media links'
            },
            {
              icon: <FiCalendar size={20} />,
              title: 'Personal Details',
              description: 'Manage birthday and other personal information'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 opacity-60">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 text-gray-500 rounded-lg">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{feature.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;