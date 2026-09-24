import { makeAutoObservable } from 'mobx'

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

  clearSelectedChat() {
    this.selectedChatId = null
  }
}

export const chatStore = new ChatStore()
