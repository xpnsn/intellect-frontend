import { Client, IMessage } from '@stomp/stompjs';
import { AuthService } from './auth-service';
import { WebSocketMessage } from '@/types/quiz';

interface MessageHandler {
  (message: WebSocketMessage<unknown>): void;
}

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, MessageHandler> = new Map();

  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const token = AuthService.getToken();
      
      if (!token) {
        reject(new Error('No authentication token found'));
        return;
      }

      this.client = new Client({
        brokerURL: `ws://localhost:8080/ws?token=${token}`,
        onConnect: () => {
          console.log('Connected to WebSocket');
          this.subscribeToUserQueue();
          resolve(true);
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
          reject(new Error(`WebSocket error: ${frame.headers.message}`));
        },
        onWebSocketClose: () => {
          console.log('WebSocket connection closed');
        },
      });

      this.client.activate();
    });
  }

  disconnect(): void {
    if (this.client && this.client.connected) {
      this.client.deactivate();
      this.client = null;
      console.log('Disconnected from WebSocket');
    }
  }

  private subscribeToUserQueue(): void {
    if (!this.client || !this.client.connected) return;
    
    this.client.subscribe('/user/queue/questions', (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body) as WebSocketMessage<unknown>;
        
        // Notify all subscribers
        this.subscriptions.forEach((callback) => {
          callback(parsedMessage);
        });
      } catch (error) {
        console.error('Failed to parse message', error);
      }
    });
  }

  subscribe(id: string, callback: MessageHandler): void {
    this.subscriptions.set(id, callback);
  }

  unsubscribe(id: string): void {
    this.subscriptions.delete(id);
  }

  startRegularQuiz(quizId: string): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination: '/app/quiz/start',
      body: JSON.stringify({ quizId }),
    });
  }

  startAIQuiz(topic: string, size: number, level: string): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination: '/app/ai/quiz/start',
      body: JSON.stringify({ topic, size, level }),
    });
  }

  sendAnswer(answer: string): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination: '/app/quiz/answer',
      body: JSON.stringify({ answer }),
    });
  }
}

export const webSocketService = new WebSocketService();