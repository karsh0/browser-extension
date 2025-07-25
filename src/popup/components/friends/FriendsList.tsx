import React, { useState } from 'react';
import { useFriends } from '../../context/FriendsContext';
import UserProfile from '../profile/OtherUserProfile';

function getDomain(url: string) {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}

interface FriendsListProps {
  homeView?: boolean;
}

const FriendsList: React.FC<FriendsListProps> = ({ homeView = false }) => {
  const { friends, loading, activeTabs, allTabs } = useFriends();
  const [selectedFriend, setSelectedFriend] = useState<null | { id: string; username: string }>(null);

  const displayFriends = homeView 
    ? friends.filter(friend => friend.isOnline)
    : friends;

  const onlineFriends = friends.filter(f => f.isOnline);
  const totalFriends = friends.length;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500" />
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
    <div className="h-full flex flex-col">
      {/* Stats Header - Only for non-home view */}
      {!homeView && (
        <div className="pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Your Friends</h3>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{onlineFriends.length} online</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{totalFriends} total</span>
            </div>
          </div>
          
          {onlineFriends.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {onlineFriends.length} friend{onlineFriends.length !== 1 ? 's' : ''} currently browsing
            </p>
          )}
        </div>
      )}

      {/* Friends List Content */}
      <div className="flex-1 overflow-y-auto">
        {!loading && displayFriends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            {homeView ? null : ( // Empty state handled by parent in home view
              <>
                <div className="bg-gray-50 rounded-full p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 015.196-2.121m.413-4.588A3 3 0 0112 7c0-1.105.413-2.107 1.196-2.925M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-base font-medium text-gray-700 mb-2">No friends yet</h4>
                <p className="text-sm text-gray-500 mb-4">Start connecting with friends to see their activity</p>
                <a 
                  href="#/friends?tab=search" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Search for friends →
                </a>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayFriends.map(friend => {
              const activeTab = friend.isOnline ? activeTabs[friend.id] : null;
              const tabs = friend.isOnline ? allTabs[friend.id] ?? [] : [];
              
              return (
                <div
                  key={friend.id}
                  className="bg-white rounded-xl shadow-sm transition-all duration-200 p-3 cursor-pointer border border-gray-100 hover:shadow-md hover:border-blue-200"
                  onClick={() => setSelectedFriend({ id: friend.id, username: friend.username })}
                >
                  {/* Friend Header */}
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                      ${friend.isOnline ? 'ring-2 ring-green-400' : 'ring-1 ring-gray-200'} bg-gradient-to-br from-blue-100 to-indigo-100`}>
                      {friend.displayName?.[0]?.toUpperCase() || friend.username[0]?.toUpperCase()}
                      {friend.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 truncate text-sm">
                          {friend.displayName || friend.username}
                        </span>
                        {friend.isOnline && (
                          <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                            Online
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">@{friend.username}</p>
                    </div>
                  </div>

                  {/* Active Tab */}
                  {activeTab && activeTab.url && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 mb-2 border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${getDomain(activeTab.url)}&sz=20`}
                          alt="Site favicon"
                          className="w-5 h-5 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-blue-700 truncate">
                              {getDomain(activeTab.url)}
                            </span>
                            <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                              Active
                            </span>
                          </div>
                          {activeTab.title && (
                            <p className="text-xs text-blue-600 truncate">
                              {activeTab.title}
                            </p>
                          )}
                        </div>
                        <a
                          href={activeTab.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 p-1"
                          onClick={e => e.stopPropagation()}
                          title="Open link"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Other Tabs */}
                  {tabs.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1 flex items-center space-x-2">
                        <span>Other tabs</span>
                        <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
                          {tabs.length}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 flex-wrap">
                        {tabs.slice(0, 6).map(tab => (
                          tab.url && (
                            <a
                              key={tab.id}
                              href={tab.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative"
                              title={`${getDomain(tab.url)} - ${tab.title}`}
                              onClick={e => e.stopPropagation()}
                            >
                              <img
                                src={`https://www.google.com/s2/favicons?domain=${getDomain(tab.url)}&sz=16`}
                                alt="Site favicon"
                                className="w-5 h-5 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                              />
                            </a>
                          )
                        ))}
                        {tabs.length > 6 && (
                          <div className="w-5 h-5 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{tabs.length - 6}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* No Activity State */}
                  {friend.isOnline && !activeTab?.url && tabs.length === 0 && (
                    <div className="text-center py-2 text-gray-400">
                      <div className="text-xs">No browsing activity</div>
                    </div>
                  )}

                  {/* Offline State */}
                  {!friend.isOnline && friend.lastSeen && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last seen {new Date(friend.lastSeen).toLocaleString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;