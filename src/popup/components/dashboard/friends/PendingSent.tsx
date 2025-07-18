import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fetchPendingSentRequests, cancelFriendRequest } from '../../../../services/api';
import UserProfile from '../../profile/OtherUserProfile';

interface Request {
  requestId: string;
  receiver: { id: string; username: string; displayName?: string };
  createdAt: string;
}

const PendingSent: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Request | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchPendingSentRequests(user.token)
      .then(res => setRequests(res.data || []))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (requestId: string) => {
    if (!user) return;
    await cancelFriendRequest(requestId, user.token);
    setRequests(reqs => reqs.filter(r => r.requestId !== requestId));
    setSelectedUser(null);
  };

  if (selectedUser) {
    return (
      <UserProfile
        username={selectedUser.receiver.username}
        friendStatus={{ status: 'pending_sent', requestId: selectedUser.requestId }}
        userId={selectedUser.receiver.id}
        onBack={() => setSelectedUser(null)}
        onStatusChange={statusObj => {
          if (statusObj.status === 'none') {
            setRequests(reqs => reqs.filter(r => r.requestId !== selectedUser.requestId));
            setSelectedUser(null);
          }
        }}
      />
    );
  }

  return (
    <div>
      {loading && <div className="text-center text-gray-400 py-4">Loading...</div>}
      {!loading && requests.length === 0 && (
        <div className="text-center text-gray-400 py-4">No sent requests.</div>
      )}
      {requests.map(req => (
        <div
          key={req.requestId}
          className="flex items-center justify-between border-b py-2 cursor-pointer hover:bg-blue-50 transition rounded"
          onClick={() => setSelectedUser(req)}
        >
          <div>
            <div className="font-medium">{req.receiver.displayName || req.receiver.username}</div>
            <div className="text-xs text-gray-500">@{req.receiver.username}</div>
          </div>
          <div>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={e => {
                e.stopPropagation();
                handleCancel(req.requestId);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingSent;