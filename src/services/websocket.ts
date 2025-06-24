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

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            
            if(data.type === 'auth' && data.success === 'false') {
                console.warn('[WebSocket] Auth failed, closing connection...');
                ws?.close();
            }
        } catch (error) {
            console.error('[WebSocket] Invalid Message format: ', error);
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