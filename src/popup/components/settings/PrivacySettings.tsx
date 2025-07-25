import React, { useEffect, useState } from 'react';
import { FiEye, FiClock, FiGlobe, FiMail, FiCalendar, FiUsers, FiCheck } from 'react-icons/fi';
import { updatePrivacySettings, fetchUserProfile } from '../../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PRIVACY_LEVELS = [
  { value: 'public', label: 'Public', icon: <FiGlobe size={16} />, desc: 'Everyone can see' },
  { value: 'friends_only', label: 'Friends Only', icon: <FiUsers size={16} />, desc: 'Only friends can see' },
  { value: 'private', label: 'Only Me', icon: <FiEye size={16} />, desc: 'Only you can see' },
];

const TAB_PRIVACY_LEVELS = [
  { value: 'friends_only', label: 'Friends Only', icon: <FiUsers size={16} />, desc: 'Only friends can see your tabs' },
  { value: 'close_friends_only', label: 'Close Friends Only', icon: <FiUsers size={16} />, desc: 'Only close friends can see' },
  { value: 'private', label: 'Only Me', icon: <FiEye size={16} />, desc: 'Only you can see your tabs' },
];

interface SettingSection {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  options: typeof PRIVACY_LEVELS | typeof TAB_PRIVACY_LEVELS;
}

const PrivacySettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    onlinePrivacy: 'public',
    lastOnlinePrivacy: 'friends_only',
    tabPrivacy: 'friends_only',
    emailPrivacy: 'friends_only',
    dobPrivacy: 'private',
    socialMediaPrivacy: 'friends_only',
    friendsListPrivacy: 'friends_only',
  });
  const [originalForm, setOriginalForm] = useState(form);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const sections: SettingSection[] = [
    {
      key: 'onlinePrivacy',
      title: 'Online Status',
      description: 'Control who can see when you\'re online',
      icon: <FiEye size={20} />,
      options: PRIVACY_LEVELS
    },
    {
      key: 'lastOnlinePrivacy',
      title: 'Last Seen',
      description: 'Control who can see your last online time',
      icon: <FiClock size={20} />,
      options: PRIVACY_LEVELS
    },
    {
      key: 'tabPrivacy',
      title: 'Tab Activity',
      description: 'Control who can see what websites you\'re browsing',
      icon: <FiGlobe size={20} />,
      options: TAB_PRIVACY_LEVELS
    },
    {
      key: 'emailPrivacy',
      title: 'Email Address',
      description: 'Control who can see your email address',
      icon: <FiMail size={20} />,
      options: PRIVACY_LEVELS
    },
    {
      key: 'dobPrivacy',
      title: 'Date of Birth',
      description: 'Control who can see your date of birth',
      icon: <FiCalendar size={20} />,
      options: PRIVACY_LEVELS
    },
    {
      key: 'socialMediaPrivacy',
      title: 'Social Media Links',
      description: 'Control who can see your social media profiles',
      icon: <FiUsers size={20} />,
      options: PRIVACY_LEVELS
    },
    {
      key: 'friendsListPrivacy',
      title: 'Friends List',
      description: 'Control who can see your friends list',
      icon: <FiUsers size={20} />,
      options: PRIVACY_LEVELS
    }
  ];

  useEffect(() => {
    if (!user) return;
    
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await fetchUserProfile(user.username, user.token);
        if (res.success && res.data) {
          const newForm = {
            onlinePrivacy: res.data.onlinePrivacy || 'public',
            lastOnlinePrivacy: res.data.lastOnlinePrivacy || 'friends_only',
            tabPrivacy: res.data.tabPrivacy || 'friends_only',
            emailPrivacy: res.data.emailPrivacy || 'friends_only',
            dobPrivacy: res.data.dobPrivacy || 'private',
            socialMediaPrivacy: res.data.socialMediaPrivacy || 'friends_only',
            friendsListPrivacy: res.data.friendsListPrivacy || 'friends_only',
          };
          setForm(newForm);
          setOriginalForm(newForm);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user || saving) return;
    
    setSaving(true);
    try {
      const response = await updatePrivacySettings(form, user.token);
      if (response.success) {
        toast.success('Privacy settings updated successfully');
        setOriginalForm(form);
      } else {
        throw new Error(response.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(originalForm);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <span className="text-gray-500">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Unsaved Changes Alert */}
          {hasChanges && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">You have unsaved changes</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {sections.map((section) => (
            <div key={section.key} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {section.options.map((option) => {
                  const isSelected = form[section.key as keyof typeof form] === option.value;
                  
                  return (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                      }`}
                      onClick={() => handleChange(section.key, option.value)}
                    >
                      <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 transition-colors flex-shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className={`p-1.5 rounded-md flex-shrink-0 ${
                        isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {option.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                          {option.label}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                          {option.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Privacy Tips */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center space-x-2">
              <FiEye size={16} />
              <span>Privacy Tips</span>
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• "Friends Only" is recommended for most settings</li>
              <li>• You can change these settings anytime</li>
              <li>• "Only Me" makes information completely private</li>
              <li>• Your privacy choices are always respected</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="border-t border-gray-200 bg-white p-4">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FiCheck size={16} />
              <span>{hasChanges ? 'Save Changes' : 'All Changes Saved'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings;