interface MessageNotificationPayload {
  senderId: string;
  senderName: string;
  content: string;
  conversationId: string;
  messageId: string;
}

interface FriendOnlineNotificationPayload {
  userId: string;
  username: string;
  displayName: string;
  timestamp: string;
}

interface FriendRequestNotificationPayload {
  senderId: string;
  senderName: string;
  senderUsername: string;
  requestId: string;
  timestamp: string;
}

interface FriendRequestAcceptedNotificationPayload {
  accepterId: string;
  accepterName: string;
  accepterUsername: string;
  timestamp: string;
}

export async function handleNewMessageNotification(payload: MessageNotificationPayload) {
  const { user } = await chrome.storage.local.get('user');
  if (!user) return;

  const parsedUser = JSON.parse(user);
  
  if (payload.senderId === parsedUser.id) return;

  if (!chrome.notifications) {
    console.warn('[NotificationService] Notifications API not available');
    return;
  }

  // Truncate long messages
  const truncatedMessage = payload.content.length > 80 
    ? payload.content.substring(0, 80) + '...' 
    : payload.content;

  chrome.notifications.create(`message-${payload.messageId}`, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title: `New message \n${payload.senderName}`,
    message: truncatedMessage,
    priority: 1,
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('[NotificationService] Message notification creation failed:', chrome.runtime.lastError);
    } else {
      console.log(`[NotificationService] Message notification created: ${notificationId}`);
    }
  });
}

export async function handleFriendOnlineNotification(payload: FriendOnlineNotificationPayload) {
  const { user } = await chrome.storage.local.get('user');
  if (!user) return;

  const parsedUser = JSON.parse(user);
  
  if (payload.userId === parsedUser.id) return;

  // const { notificationSettings } = await chrome.storage.local.get('notificationSettings');
  // const settings = notificationSettings ? JSON.parse(notificationSettings) : {};
  
  // if (settings.friendOnline === false) return;

  if (!chrome.notifications) {
    console.warn('[NotificationService] Notifications API not available');
    return;
  }

  const friendName = payload.displayName || payload.username;

  chrome.notifications.create(`friend-online-${payload.userId}`, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title: 'Friend Online',
    message: `${friendName} is now online`,
    priority: 0,
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('[NotificationService] Friend online notification creation failed:', chrome.runtime.lastError);
    } else {
      console.log(`[NotificationService] Friend online notification created: ${notificationId}`);
    }
  });
}

export async function handleFriendRequestNotification(payload: FriendRequestNotificationPayload) {
  const { user } = await chrome.storage.local.get('user');
  if (!user) return;

  const parsedUser = JSON.parse(user);
  
  if (payload.senderId === parsedUser.id) return;

  // const { notificationSettings } = await chrome.storage.local.get('notificationSettings');
  // const settings = notificationSettings ? JSON.parse(notificationSettings) : {};
  
  // if (settings.friendRequests === false) return;

  if (!chrome.notifications) {
    console.warn('[NotificationService] Notifications API not available');
    return;
  }

  chrome.notifications.create(`friend-request-${payload.requestId}`, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title: 'New Friend Request',
    message: `${payload.senderName} sent you a friend request`,
    priority: 1, // Same priority as messages
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('[NotificationService] Friend request notification creation failed:', chrome.runtime.lastError);
    } else {
      console.log(`[NotificationService] Friend request notification created: ${notificationId}`);
    }
  });
}

export async function handleFriendRequestAcceptedNotification(payload: FriendRequestAcceptedNotificationPayload) {
  const { user } = await chrome.storage.local.get('user');
  if (!user) return;

  const parsedUser = JSON.parse(user);
  
  if (payload.accepterId === parsedUser.id) return;

  const { notificationSettings } = await chrome.storage.local.get('notificationSettings');
  const settings = notificationSettings ? JSON.parse(notificationSettings) : {};
  
  if (settings.friendRequestAccepted === false) return;

  if (!chrome.notifications) {
    console.warn('[NotificationService] Notifications API not available');
    return;
  }

  chrome.notifications.create(`friend-accepted-${payload.accepterId}`, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icons/icon128.png'),
    title: 'Friend Request Accepted',
    message: `${payload.accepterName} accepted your friend request`,
    priority: 1,
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('[NotificationService] Friend request accepted notification creation failed:', chrome.runtime.lastError);
    } else {
      console.log(`[NotificationService] Friend request accepted notification created: ${notificationId}`);
    }
  });
}
