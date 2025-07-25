import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchPendingReceivedRequests, acceptFriendRequest, ignoreFriendRequest } from '../../../services/api';
import UserProfile from '../profile/OtherUserProfile';

interface Request {
  requestId: string;
  sender: { id: string; username: string; displayName?: string };
  createdAt: string;
}

const PendingReceived: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Request | null>(null);

  if (!user) {
    return <div className="text-center text-gray-400 py-4">Please log in to view requests.</div>;
  }

  useEffect(() => {
    setLoading(true);
    fetchPendingReceivedRequests(user.token)
      .then(res => setRequests(res.data || []))
      .finally(() => setLoading(false));
  }, [user]);

  const handleStatusChange = (statusObj: { status: string }) => {
    if (statusObj.status === 'none' && selectedUser) {
      setRequests(reqs => reqs.filter(r => r.requestId !== selectedUser.requestId));
      setSelectedUser(null);
    }
    if (statusObj.status === 'friends' && selectedUser) {
      setRequests(reqs => reqs.filter(r => r.requestId !== selectedUser.requestId));
      setSelectedUser(null);
    }
  };

  if (selectedUser) {
    return (
      <UserProfile
        username={selectedUser.sender.username}
        friendStatus={{ status: 'pending_received', requestId: selectedUser.requestId }}
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
        <div className="text-center text-gray-400 py-4">No received requests.</div>
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
              className="px-2 py-1 bg-green-500 text-white rounded mr-2"
              onClick={async e => {
                e.stopPropagation();
                await acceptFriendRequest(req.requestId, user.token);
                setRequests(requests.filter(r => r.requestId !== req.requestId));
              }}
            >
              Accept
            </button>
            <button
              className="px-2 py-1 bg-gray-300 text-gray-700 rounded"
              onClick={async e => {
                e.stopPropagation();
                await ignoreFriendRequest(req.requestId, user.token);
                setRequests(requests.filter(r => r.requestId !== req.requestId));
              }}
            >
              Ignore
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingReceived;