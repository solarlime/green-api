import { makeAutoObservable } from 'mobx';
import {
  receiveNotification,
  deleteNotification,
  type NotificationBody,
} from '../services/greenApi';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isSent: boolean;
  isPending?: boolean;
}

export interface Chat {
  id: string;
  phoneNumber: number;
  username?: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

class ChatStore {
  chats: Chat[] = [];
  selectedChatId: string | null = null;
  messages: Map<string, Message[]> = new Map();
  pollingTimeout: NodeJS.Timeout | null = null;
  isPollingActive: boolean = false;

  constructor() {
    makeAutoObservable(this);

    // Stop polling before page unload
    window.addEventListener('beforeunload', () => {
      this.stopPolling();
    });
  }

  addChat(chat: Chat) {
    this.chats.unshift(chat);
    this.startPolling();
  }

  selectChat(chatId: string) {
    this.selectedChatId = chatId;
  }

  get selectedChat(): Chat | undefined {
    return this.chats.find((chat) => chat.id === this.selectedChatId);
  }

  get selectedChatMessages(): Message[] {
    if (!this.selectedChatId) return [];
    return this.messages.get(this.selectedChatId) || [];
  }

  addMessage(chatId: string, message: Message) {
    const chatMessages = this.messages.get(chatId) || [];
    chatMessages.push(message);
    this.messages.set(chatId, chatMessages);

    // Update last message in chat
    const chat = this.chats.find((c) => c.id === chatId);
    if (chat) {
      chat.lastMessage = message.text;
      chat.lastMessageTime = new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  updateMessage(chatId: string, messageId: string, updates: Partial<Message>) {
    const chatMessages = this.messages.get(chatId);
    if (chatMessages) {
      const message = chatMessages.find((m) => m.id === messageId);
      if (message) {
        Object.assign(message, updates);
      }
    }
  }

  async startPolling() {
    if (this.isPollingActive) {
      console.log('Polling already active, skipping start');
      return;
    }

    console.log('Starting polling');
    this.isPollingActive = true;

    const poll = async () => {
      try {
        console.log('Polling for notification...');
        const notification = await receiveNotification(30);
        console.log('Received notification:', notification);

        if (notification && notification.body) {
          this.handleNotification(notification.body);
          // Delete notification after processing
          await deleteNotification(notification.receiptId);
          console.log('Notification processed and deleted');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }

      // Continue polling if still active
      if (this.isPollingActive) {
        console.log('Scheduling next poll');
        this.pollingTimeout = setTimeout(() => poll(), 0);
      } else {
        console.log('Polling stopped, not scheduling next poll');
      }
    };

    this.pollingTimeout = setTimeout(() => poll(), 0);
  }

  stopPolling() {
    this.isPollingActive = false;
    if (this.pollingTimeout) {
      clearTimeout(this.pollingTimeout);
      this.pollingTimeout = null;
    }
  }

  handleNotification(body: NotificationBody) {
    const { senderData, messageData, idMessage, timestamp } = body;

    // Check if this is a text message
    if (
      messageData.typeMessage === 'textMessage' &&
      messageData.textMessageData
    ) {
      const message: Message = {
        id: idMessage,
        text: messageData.textMessageData.textMessage,
        timestamp: new Date(timestamp * 1000),
        isSent: false,
      };

      this.addMessage(senderData.chatId, message);
    }
  }

  clearSelectedChat() {
    this.selectedChatId = null;
  }
}

export const chatStore = new ChatStore();
