import React, { useEffect, useState } from 'react';
import { updatePrivacySettings, fetchUserProfile } from '../../../services/api';
import { useAuth } from '../../context/AuthContext';

const PRIVACY_LEVELS = [
  { value: 'public', label: 'Public' },
  { value: 'friends_only', label: 'Friends Only' },
  { value: 'private', label: 'Only Me' },
];

const TAB_PRIVACY_LEVELS = [
  { value: 'friends_only', label: 'Friends Only' },
  { value: 'close_friends_only', label: 'Close Friends Only' },
  { value: 'private', label: 'Only Me' },
];

const sectionStyle = "bg-gray-50 rounded-lg p-4 mb-4 shadow-sm";
const labelStyle = "block font-semibold text-gray-800 mb-1";
const descStyle = "text-xs text-gray-500 mb-2";

const SettingsPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    onlinePrivacy: 'public',
    lastOnlinePrivacy: 'friends_only',
    tabPrivacy: 'friends_only',
    emailPrivacy: 'friends_only',
    dobPrivacy: 'private',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchUserProfile(user.username, user.token).then(res => {
      if (res.data) {
        setForm({
          onlinePrivacy: res.data.onlinePrivacy || 'public',
          lastOnlinePrivacy: res.data.lastOnlinePrivacy || 'friends_only',
          tabPrivacy: res.data.tabPrivacy || 'friends_only',
          emailPrivacy: res.data.emailPrivacy || 'friends_only',
          dobPrivacy: res.data.dobPrivacy || 'private',
        });
      }
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSuccess(false);
    try {
      await updatePrivacySettings(form, user.token);
      setSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-0">
      {/* Top bar */}
      <div className="flex w-full mb-4 space-x-2 px-6 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="w-1/2 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-semibold"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-1/2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <form className="px-6 pb-6" onSubmit={handleSubmit}>
        {/* Online Status */}
        <div className={sectionStyle}>
          <div className={labelStyle}>Online Status</div>
          <div className={descStyle}>Who can see when you're online?</div>
          <div className="flex gap-4">
            {PRIVACY_LEVELS.map(opt => (
              <label key={opt.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="onlinePrivacy"
                  value={opt.value}
                  checked={form.onlinePrivacy === opt.value}
                  onChange={handleChange}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Last Online */}
        <div className={sectionStyle}>
          <div className={labelStyle}>Last Seen</div>
          <div className={descStyle}>Who can see your last online time?</div>
          <div className="flex gap-4">
            {PRIVACY_LEVELS.map(opt => (
              <label key={opt.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="lastOnlinePrivacy"
                  value={opt.value}
                  checked={form.lastOnlinePrivacy === opt.value}
                  onChange={handleChange}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Tab Activity */}
        <div className={sectionStyle}>
          <div className={labelStyle}>Tab Activity</div>
          <div className={descStyle}>Who can see what tabs you're using?</div>
          <div className="flex gap-4">
            {TAB_PRIVACY_LEVELS.map(opt => (
              <label key={opt.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tabPrivacy"
                  value={opt.value}
                  checked={form.tabPrivacy === opt.value}
                  onChange={handleChange}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Email */}
        <div className={sectionStyle}>
          <div className={labelStyle}>Email</div>
          <div className={descStyle}>Who can see your email address?</div>
          <div className="flex gap-4">
            {PRIVACY_LEVELS.map(opt => (
              <label key={opt.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="emailPrivacy"
                  value={opt.value}
                  checked={form.emailPrivacy === opt.value}
                  onChange={handleChange}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Date of Birth */}
        <div className={sectionStyle}>
          <div className={labelStyle}>Date of Birth</div>
          <div className={descStyle}>Who can see your date of birth?</div>
          <div className="flex gap-4">
            {PRIVACY_LEVELS.map(opt => (
              <label key={opt.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="dobPrivacy"
                  value={opt.value}
                  checked={form.dobPrivacy === opt.value}
                  onChange={handleChange}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        {success && <div className="text-green-600 text-sm mt-2">Privacy updated!</div>}
      </form>
      <div className="mt-4 text-gray-400 text-xs text-center pb-4">
        More profile and account settings coming soon.
      </div>
    </div>
  );
};

export default SettingsPanel;