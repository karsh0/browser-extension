import { publishActiveTab } from "./tabTracking";
import { handleNewMessageNotification, handleFriendOnlineNotification, handleFriendRequestNotification, handleFriendRequestAcceptedNotification } from "./notifications";

const BACKEND_URL = process.env.BACKEND_URL;
const WS_URL = BACKEND_URL ? BACKEND_URL.replace(/^http/, 'ws') : "";
let ws: WebSocket | null = null;
let heartbeatInterval: NodeJS.Timeout | null = null;

export function isWebSocketConnected(): boolean {
    return ws !== null && ws.readyState === WebSocket.OPEN;
}

export async function initializeWebSocket() {
    if(isWebSocketConnected()){
        console.log('[WebSocket] Already connected, skipping initialization ...');
        return;
    }

    const { user }  = await chrome.storage.local.get('user');
    if (!user) {
        console.log('[WebSocket] No user data found, skipping connection ...');
        return;
    }

    const parsedUser = JSON.parse(user);
    if (!parsedUser?.token) {
        console.log('[WebSocket] No user token found, skipping conection ...');
        return;
    }

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        const authMessage = { type: 'auth', token: parsedUser.token };
        ws?.send(JSON.stringify(authMessage));

        if (heartbeatInterval) clearInterval(heartbeatInterval);

        heartbeatInterval = setInterval(() => {
            if(ws && ws.readyState === WebSocket.OPEN) {
                const heartbeatMessage = { type: 'ping' };
                ws.send(JSON.stringify(heartbeatMessage));
            }
        }, 10000);
    };

    ws.onmessage = async (event) => {
        try {
            const data = JSON.parse(event.data);
            
            if(data.type === 'auth' && data.success === 'false') {
                console.warn('[WebSocket] Auth failed, closing connection...');
                ws?.close();
            }

            if(data.type === 'auth' && data.success) {
                publishActiveTab();
            }

            if (data.type === 'friend_tab_update') {
                // console.log('[WebSocket-extension] Received friend tab update:', data);
                chrome.runtime.sendMessage({
                    type: 'FRIEND_TAB_UPDATE',
                    payload: data
                }).catch((e) => {
                    console.warn('[WebSocket-extension] Error sending FRIEND_TAB_UPDATE message:', e);
                });
            }

            if (data.type === 'friend_active_tab_update') {
                console.log('[WebSocket-extension] Received friend active tab update:', data);
                chrome.runtime.sendMessage({
                    type: 'FRIEND_ACTIVE_TAB_UPDATE',
                    payload: data
                }).catch((e) => {
                    console.warn('[WebSocket-extension] Error sending FRIEND_ACTIVE_TAB_UPDATE message:', e);
                });
            }

            if (data.type === 'NEW_MESSAGE') {
                console.log('[WebSocket-extension] Received new message:', data);
                
                try {
                    await chrome.runtime.sendMessage({
                        type: 'NEW_MESSAGE',
                        payload: data.data
                    });
                } catch (error) {
                    console.warn('[WebSocket-extension] Popup not available for NEW_MESSAGE:', error);
                }

                await handleNewMessageNotification({
                    senderId: data.data.senderId,
                    senderName: data.data.sender?.displayName || data.data.sender?.username || 'Unknown',
                    content: data.data.content,
                    conversationId: data.data.conversationId,
                    messageId: data.data.id
                });
            }

            if (data.type === 'FRIEND_ONLINE') {
                
                try {
                    await chrome.runtime.sendMessage({
                        type: 'FRIEND_ONLINE',
                        payload: data.data
                    });
                } catch (error) {
                    console.warn('[WebSocket-extension] Popup not available for FRIEND_ONLINE:', error);
                }
                
                await handleFriendOnlineNotification({
                    userId: data.data.userId,
                    username: data.data.username,
                    displayName: data.data.displayName,
                    timestamp: data.data.timestamp
                });
            }

            if (data.type === 'FRIEND_REQUEST_RECEIVED') {
                console.log('[WebSocket-extension] Received friend request:', data);
                
                try {
                    await chrome.runtime.sendMessage({
                        type: 'FRIEND_REQUEST_RECEIVED',
                        payload: data.data
                    });
                } catch (error) {
                    console.warn('[WebSocket-extension] Popup not available for FRIEND_REQUEST_RECEIVED:', error);
                }

                await handleFriendRequestNotification({
                    senderId: data.data.senderId,
                    senderName: data.data.senderName,
                    senderUsername: data.data.senderUsername,
                    requestId: data.data.requestId,
                    timestamp: data.data.timestamp
                });
            }

            if (data.type === 'FRIEND_REQUEST_ACCEPTED') {
                console.log('[WebSocket-extension] Friend request accepted:', data);
                
                try {
                    await chrome.runtime.sendMessage({
                        type: 'FRIEND_REQUEST_ACCEPTED',
                        payload: data.data
                    });
                } catch (error) {
                    console.warn('[WebSocket-extension] Popup not available for FRIEND_REQUEST_ACCEPTED:', error);
                }

                await handleFriendRequestAcceptedNotification({
                    accepterId: data.data.accepterId,
                    accepterName: data.data.accepterName,
                    accepterUsername: data.data.accepterUsername,
                    timestamp: data.data.timestamp
                });
            }
        } catch (error) {
            console.error('[WebSocket-extension] Invalid Message format: ', error);
        }
    }

    ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
    };

    ws.onclose = () => {
        if( heartbeatInterval) clearInterval(heartbeatInterval);
        heartbeatInterval = null;
        ws = null;
    };
}

export function closeWebSocket() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  if (ws) {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
    }
    ws = null;
  }
}

export function getWebSocket() {
    return ws;
}