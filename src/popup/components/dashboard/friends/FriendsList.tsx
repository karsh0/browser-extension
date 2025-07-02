import React, { useState } from 'react';
import { useFriends } from '../../../context/FriendsContext';
import UserProfile from './UserProfile';

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
    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
      {friends.map(friend => (
        <div
          key={friend.id}
          className="p-3 flex flex-col cursor-pointer hover:bg-blue-50 transition"
          onClick={() => setSelectedFriend({ id: friend.id, username: friend.username })}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium">{friend.displayName || friend.username}</span>
              {friend.isOnline ? (
                <span className="text-sm text-green-600">Online</span>
              ) : (
                <span className="text-sm text-gray-500">
                  Offline{friend.lastSeen ? ` - Last seen ${new Date(friend.lastSeen).toLocaleString()}` : ''}
                </span>
              )}
            </div>
          </div>
          {/* Show active tab if online and available */}
          {friend.isOnline && activeTabs[friend.id] && (
            <div className="mt-2 ml-2 p-2 bg-blue-50 rounded text-xs">
              <div className="font-semibold text-blue-700 truncate">
                {activeTabs[friend.id]?.title}
              </div>
              <a
                href={activeTabs[friend.id]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all"
              >
                {activeTabs[friend.id]?.url}
              </a>
            </div>
          )}
          {/* Show all tabs if online and available */}
          {friend.isOnline && allTabs[friend.id] && allTabs[friend.id]!.length > 0 && (
            <div className="mt-2 ml-2 p-2 bg-gray-50 rounded text-xs">
              <div className="font-semibold text-gray-700 mb-1">All Tabs:</div>
              <ul className="space-y-1">
                {(allTabs[friend.id] ?? []).map(tab => (
                  <li key={tab.id} className="truncate">
                    <span className="font-medium">{tab.title}</span>
                    <a
                      href={tab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-500 underline break-all"
                    >
                      {tab.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FriendsList;