import { makeAutoObservable } from 'mobx'

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

  constructor() {
    makeAutoObservable(this)
  }

  addChat(chat: Chat) {
    this.chats.unshift(chat)
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

  clearSelectedChat() {
    this.selectedChatId = null
  }
}

export const chatStore = new ChatStore()
