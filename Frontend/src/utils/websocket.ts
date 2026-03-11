export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, (payload: unknown) => void> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('❌ Error parsing message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  send(type: string, payload?: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type,
        payload,
        timestamp: new Date().toISOString(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('❌ WebSocket not connected');
    }
  }

  on(type: string, handler: (payload: unknown) => void): void {
    this.messageHandlers.set(type, handler);
  }

  off(type: string): void {
    this.messageHandlers.delete(type);
  }

  private handleMessage(message: unknown): void {
    if (!message || typeof message !== 'object' || !('type' in message)) return;
    const msg = message as { type?: unknown; payload?: unknown };
    if (typeof msg.type !== 'string') return;

    const handler = this.messageHandlers.get(msg.type);
    if (handler) {
      handler(msg.payload);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('❌ Reconnect failed:', error);
        });
      }, this.reconnectDelay);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}