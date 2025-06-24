import React from 'react';
import { useFriends } from '../../../context/FriendsContext';

const FriendsList: React.FC = () => {
  const { friends, loading } = useFriends();

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
      {friends.map(friend => (
        <div key={friend.id} className="p-3 flex items-center justify-between">
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
      ))}
    </div>
  );
};

export default FriendsList;