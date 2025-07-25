import React, { useState } from 'react';
import { FiSearch, FiUserPlus, FiX, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { searchUsers, getFriendshipStatus, sendFriendRequest, cancelFriendRequest } from '../../../services/api';
import UserProfile from '../profile/OtherUserProfile';
import toast from 'react-hot-toast';

interface UserResult {
  id: string;
  username: string;
  displayName?: string;
}

const SearchFriends: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [statuses, setStatuses] = useState<Record<string, {status: string, requestId?: string}>>({});
  const [loading, setLoading] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-center py-8">
        <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-500">Please log in to search for friends</p>
      </div>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const res = await searchUsers(query, user.token);
      setResults(res.data || []);
      
      const statusMap: Record<string, {status: string, requestId?: string}> = {};
      await Promise.all(
        (res.data || []).map(async (u: UserResult) => {
          const statusRes = await getFriendshipStatus(u.id, user.token);
          statusMap[u.id] = { status: statusRes.status, requestId: statusRes.requestId };
        })
      );
      setStatuses(statusMap);
      
      if (res.data?.length === 0) {
        toast.error('No users found with that username');
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (id: string, username: string) => {
    try {
      await sendFriendRequest(id, user.token);
      toast.success(`Friend request sent to ${username}`);
      
      const statusRes = await getFriendshipStatus(id, user.token);
      setStatuses(s => ({ ...s, [id]: { status: statusRes.status, requestId: statusRes.requestId } }));
    } catch (error) {
      toast.error('Failed to send friend request');
    }
  };

  const handleCancel = async (requestId: string, userId: string, username: string) => {
    try {
      await cancelFriendRequest(requestId, user.token);
      toast.success(`Cancelled request to ${username}`);
      setStatuses(s => ({ ...s, [userId]: { status: 'none' } }));
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setStatuses({});
  };

  if (selectedUsername) {
    const selectedUser = results.find(u => u.username === selectedUsername);
    const friendStatus = selectedUser ? statuses[selectedUser.id] : undefined;

    return (
      <UserProfile
        username={selectedUsername}
        friendStatus={friendStatus}
        userId={selectedUser?.id}
        onBack={() => setSelectedUsername(null)}
        onStatusChange={statusObj =>
          setStatuses(s =>
            selectedUser?.id ? { ...s, [selectedUser.id]: statusObj } : s
          )
        }
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="pb-3 mb-3 border-b border-gray-100">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-3">
          <FiUserPlus className="text-blue-600" size={18} />
          <h3 className="font-semibold text-gray-800">Find New Friends</h3>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className='pl-[7px] pr-[7px]'>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              className="w-full pl-9 pr-20 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Search username..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            
            {query && !loading && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={14} />
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
              ) : (
                <FiSearch size={14} />
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <span className="text-sm text-gray-500">Searching...</span>
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-8">
            <FiSearch className="mx-auto text-gray-400 mb-3" size={32} />
            <h4 className="font-medium text-gray-700 mb-1">No users found</h4>
            <p className="text-sm text-gray-500">Try a different username or display name</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-2">
            {results.map(userRes => (
              <div
                key={userRes.id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => setSelectedUsername(userRes.username)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center font-semibold text-blue-600 text-sm flex-shrink-0">
                      {userRes.displayName?.[0]?.toUpperCase() || userRes.username[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate text-sm">
                        {userRes.displayName || userRes.username}
                      </div>
                      <div className="text-xs text-gray-500 truncate">@{userRes.username}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div onClick={e => e.stopPropagation()} className="flex-shrink-0 ml-2">
                    {statuses[userRes.id]?.status === 'none' && (
                      <button
                        className="px-2.5 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 text-xs"
                        onClick={() => handleAdd(userRes.id, userRes.username)}
                      >
                        <FiUserPlus size={12} />
                        <span>Add</span>
                      </button>
                    )}
                    
                    {statuses[userRes.id]?.status === 'pending_sent' && (
                      <button
                        className="px-2.5 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-xs"
                        onClick={() => {
                          const requestId = statuses[userRes.id]?.requestId;
                          if (requestId) {
                            handleCancel(requestId, userRes.id, userRes.username);
                          }
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    
                    {statuses[userRes.id]?.status === 'pending_received' && (
                      <span className="px-2.5 py-1.5 bg-yellow-100 text-yellow-700 rounded-md text-xs">
                        Pending
                      </span>
                    )}
                    
                    {statuses[userRes.id]?.status === 'friends' && (
                      <span className="px-2.5 py-1.5 bg-green-100 text-green-700 rounded-md text-xs flex items-center space-x-1">
                        <FiUsers size={12} />
                        <span>Friends</span>
                      </span>
                    )}
                    
                    {statuses[userRes.id]?.status === 'ignored' && (
                      <span className="px-2.5 py-1.5 bg-gray-100 text-gray-500 rounded-md text-xs">
                        Ignored
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Tips */}
        {!query && results.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 text-sm">Search Tips</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Enter a username to find friends</li>
              <li>• Search by display name works too</li>
              <li>• Usernames are case-sensitive</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFriends;