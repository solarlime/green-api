import { makeAutoObservable } from 'mobx'
import { receiveNotification, deleteNotification, type NotificationBody } from '../services/greenApi'

export interface Message {
  id: string
  text: string
  timestamp: Date
  isSent: boolean
  isPending?: boolean
}

export interface Chat {
  id: string
  phoneNumber: number
  username?: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
}

class ChatStore {
  chats: Chat[] = []
  selectedChatId: string | null = null
  messages: Map<string, Message[]> = new Map()
  pollingIntervals: Map<string, NodeJS.Timeout> = new Map()

  constructor() {
    makeAutoObservable(this)
  }

  addChat(chat: Chat) {
    this.chats.unshift(chat)
    this.startPolling(chat.id)
  }

  selectChat(chatId: string) {
    this.selectedChatId = chatId
  }

  get selectedChat(): Chat | undefined {
    return this.chats.find(chat => chat.id === this.selectedChatId)
  }

  get selectedChatMessages(): Message[] {
    if (!this.selectedChatId) return []
    return this.messages.get(this.selectedChatId) || []
  }

  addMessage(chatId: string, message: Message) {
    const chatMessages = this.messages.get(chatId) || []
    chatMessages.push(message)
    this.messages.set(chatId, chatMessages)

    // Update last message in chat
    const chat = this.chats.find(c => c.id === chatId)
    if (chat) {
      chat.lastMessage = message.text
      chat.lastMessageTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
  }

  updateMessage(chatId: string, messageId: string, updates: Partial<Message>) {
    const chatMessages = this.messages.get(chatId)
    if (chatMessages) {
      const message = chatMessages.find(m => m.id === messageId)
      if (message) {
        Object.assign(message, updates)
      }
    }
  }

  async startPolling(chatId: string) {
    if (this.pollingIntervals.has(chatId)) {
      return
    }

    const poll = async () => {
      try {
        const notification = await receiveNotification(30)

        if (notification && notification.body) {
          this.handleNotification(notification.body)
          // Delete notification after processing
          await deleteNotification(notification.receiptId)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }

      // Continue polling after response is received
      await poll()
    }

    await poll()
  }

  stopPolling(chatId: string) {
    const interval = this.pollingIntervals.get(chatId)
    if (interval) {
      clearTimeout(interval)
      this.pollingIntervals.delete(chatId)
    }
  }

  handleNotification(body: NotificationBody) {
    const { senderData, messageData, idMessage, timestamp } = body

    // Check if this is a text message
    if (messageData.typeMessage === 'textMessage' && messageData.textMessageData) {
      const message: Message = {
        id: idMessage,
        text: messageData.textMessageData.textMessage,
        timestamp: new Date(timestamp * 1000),
        isSent: false,
      }

      this.addMessage(senderData.chatId, message)
    }
  }

  clearSelectedChat() {
    this.selectedChatId = null
  }
}

export const chatStore = new ChatStore()
