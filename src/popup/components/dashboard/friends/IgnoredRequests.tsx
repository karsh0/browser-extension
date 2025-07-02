import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fetchIgnoredRequests, acceptFriendRequest } from '../../../../services/api';
import UserProfile from './UserProfile';

interface IgnoredRequest {
  requestId: string;
  sender: { id: string; username: string; displayName?: string };
  createdAt: string;
}

const IgnoredRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<IgnoredRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<IgnoredRequest | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchIgnoredRequests(user.token)
      .then(res => setRequests(res.data || []))
      .finally(() => setLoading(false));
  }, [user]);

  const handleAccept = async (requestId: string) => {
    if (!user) return;
    await acceptFriendRequest(requestId, user.token);
    setRequests(reqs => reqs.filter(r => r.requestId !== requestId));
    setSelectedUser(null);
  };

  const handleStatusChange = (statusObj: { status: string }) => {
    if ((statusObj.status === 'none' || statusObj.status === 'friends') && selectedUser) {
      setRequests(reqs => reqs.filter(r => r.requestId !== selectedUser.requestId));
      setSelectedUser(null);
    }
  };

  if (selectedUser) {
    return (
      <UserProfile
        username={selectedUser.sender.username}
        friendStatus={{ status: 'ignored', requestId: selectedUser.requestId }}
        userId={selectedUser.sender.id}
        onBack={() => setSelectedUser(null)}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <div>
      {loading && <div className="text-center text-gray-400 py-4">Loading...</div>}
      {!loading && requests.length === 0 && (
        <div className="text-center text-gray-400 py-4">No ignored requests.</div>
      )}
      {requests.map(req => (
        <div
          key={req.requestId}
          className="flex items-center justify-between border-b py-2 cursor-pointer hover:bg-blue-50 transition rounded"
          onClick={() => setSelectedUser(req)}
        >
          <div>
            <div className="font-medium">{req.sender.displayName || req.sender.username}</div>
            <div className="text-xs text-gray-500">@{req.sender.username}</div>
          </div>
          <div>
            <button
              className="px-2 py-1 bg-green-500 text-white rounded"
              onClick={e => {
                e.stopPropagation();
                handleAccept(req.requestId);
              }}
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IgnoredRequests;