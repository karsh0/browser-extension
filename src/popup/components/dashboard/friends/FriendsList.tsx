import React, { useState } from 'react';
import { useFriends } from '../../../context/FriendsContext';
import UserProfile from './UserProfile';

function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

const FriendsList: React.FC = () => {
  const { friends, loading, activeTabs, allTabs } = useFriends();
  const [selectedFriend, setSelectedFriend] = useState<null | { id: string; username: string }>(null);

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
        <div className="animate-pulse h-5 w-5 rounded-full bg-blue-400" />
      </div>
    );
  }

  if (!loading && friends.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-500">No friends found</p>
      </div>
    );
  }

  if (selectedFriend) {
    return (
      <UserProfile
        username={selectedFriend.username}
        userId={selectedFriend.id}
        onBack={() => setSelectedFriend(null)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {friends.map(friend => {
        const activeTab = friend.isOnline ? activeTabs[friend.id] : null;
        const tabs = friend.isOnline ? allTabs[friend.id] ?? [] : [];
        return (
          <div
            key={friend.id}
            className="bg-white rounded-2xl shadow transition-transform duration-150 p-4 flex flex-col gap-2 cursor-pointer border border-gray-100 hover:scale-[1.025] hover:shadow-xl"
            onClick={() => setSelectedFriend({ id: friend.id, username: friend.username })}
            style={{ willChange: 'transform' }}
          >
            <div className="flex items-center gap-3">
              <div className={`relative w-11 h-11 rounded-full flex items-center justify-center text-lg font-semibold
                ${friend.isOnline ? 'ring-2 ring-green-400' : 'ring-1 ring-gray-200'} bg-gradient-to-br from-blue-100 to-indigo-100`}>
                {friend.displayName?.[0]?.toUpperCase() || friend.username[0]?.toUpperCase()}
                {friend.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 text-base">{friend.displayName || friend.username}</span>
                <span className="text-xs text-gray-400">@{friend.username}</span>
                {friend.isOnline ? (
                  <span className="text-xs text-green-600 font-normal mt-1">Online</span>
                ) : (
                  friend.lastSeen && (
                    <span className="text-xs text-gray-400 mt-1">
                      Last seen {new Date(friend.lastSeen).toLocaleString()}
                    </span>
                  )
                )}
              </div>
            </div>
            {/* Active Tab */}
            {activeTab && activeTab.url && (
              <div className="flex items-center gap-3 mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100 shadow-inner">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${getDomain(activeTab.url)}&sz=48`}
                  alt="Favicon"
                  className="w-10 h-10 rounded shadow"
                />
                <a
                  href={activeTab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 font-medium text-base hover:underline truncate max-w-[140px]"
                  title={activeTab.url}
                  onClick={e => e.stopPropagation()}
                >
                  {getDomain(activeTab.url)}
                </a>
                <span className="ml-auto px-2 py-1 bg-blue-200 text-blue-700 rounded-full text-xs font-medium">Active</span>
              </div>
            )}
            {/* All Tabs */}
            {tabs.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap mt-1">
                {tabs.map(tab => (
                  tab.url && (
                    <a
                      key={tab.id}
                      href={tab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                      title={tab.url}
                      onClick={e => e.stopPropagation()}
                    >
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${getDomain(tab.url)}&sz=20`}
                        alt="Favicon"
                        className="w-6 h-6 rounded border border-gray-200 shadow-sm transition group-hover:ring-2 group-hover:ring-blue-400"
                      />
                      <span className="absolute z-10 left-1/2 -translate-x-1/2 bottom-8 opacity-0 group-hover:opacity-100 pointer-events-none bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap transition">
                        {getDomain(tab.url)}
                      </span>
                    </a>
                  )
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FriendsList;