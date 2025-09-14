import React, { useState, useEffect } from 'react';
import { FiBell, FiUserPlus, FiMessageSquare, FiCheck, FiMoreVertical, FiArrowLeft } from 'react-icons/fi';
import { HiOutlineChatBubbleLeftEllipsis, HiOutlineUserPlus } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationCount } from '../../services/api';
import { useAuth } from '../context/AuthContext';

interface NotificationData {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  fromUser?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  metadata?: any;
}

interface NotificationResponse {
  success: boolean;
  data: {
    notifications: NotificationData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      unreadCount: number;
    };
  };
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const token = user?.token;

  const fetchNotificationsData = async (pageNum = 1, unreadOnly = false, append = false) => {
    if (!token) return;
    
    try {
      setLoading(!append);
      const response: NotificationResponse = await fetchNotifications(token, pageNum, 20, unreadOnly);
      
      if (response.success) {
        const newNotifications = response.data.notifications;
        
        if (append) {
          setNotifications(prev => [...prev, ...newNotifications]);
        } else {
          setNotifications(newNotifications);
        }
        
        setUnreadCount(response.data.pagination.unreadCount);
        setHasMore(pageNum < response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationsData(1, showUnreadOnly);
    setPage(1);
  }, [showUnreadOnly, token]);

  const handleNotificationClick = async (notification: NotificationData) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.id, token!);
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate based on notification type
    if (notification.actionUrl) {
      if (notification.actionUrl.includes('/friends')) {
        navigate('/friends');
      } else if (notification.actionUrl.includes('/inbox')) {
        navigate('/inbox');
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token || unreadCount === 0) return;
    
    try {
      await markAllNotificationsAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotificationsData(nextPage, showUnreadOnly, true);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'FRIEND_REQUEST_RECEIVED':
        return <HiOutlineUserPlus className="w-6 h-6 text-blue-500" />;
      case 'FRIEND_REQUEST_ACCEPTED':
        return <FiCheck className="w-6 h-6 text-green-500" />;
      case 'CONVERSATION_INVITE':
        return <HiOutlineChatBubbleLeftEllipsis className="w-6 h-6 text-purple-500" />;
      case 'CONVERSATION_ACCEPTED':
        return <FiMessageSquare className="w-6 h-6 text-green-500" />;
      default:
        return <FiBell className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}w`;
  };

  const getAvatarInitials = (displayName?: string, username?: string) => {
    const name = displayName || username || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
        </div>
        
        <button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Mark all read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setShowUnreadOnly(false)}
          className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
            !showUnreadOnly
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setShowUnreadOnly(true)}
          className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors relative ${
            showUnreadOnly
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <FiBell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {showUnreadOnly ? "You're all caught up!" : "When you get notifications, they'll show up here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar or Icon */}
                  {notification.fromUser ? (
                    <div className="relative">
                      {notification.fromUser.avatarUrl ? (
                        <img
                          src={notification.fromUser.avatarUrl}
                          alt={notification.fromUser.displayName || notification.fromUser.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {getAvatarInitials(notification.fromUser.displayName, notification.fromUser.username)}
                          </span>
                        </div>
                      )}
                      {/* Notification type icon overlay */}
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="p-4 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="text-blue-600 font-medium hover:text-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;