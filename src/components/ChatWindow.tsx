import {
  ArrowUpIcon,
  XIcon,
  ListIcon,
  ChecksIcon
} from '@phosphor-icons/react';
import { Avatar } from '@radix-ui/react-avatar';
import { observer } from 'mobx-react-lite';
import { useState, useOptimistic, useTransition } from 'react';
import { chatStore, type Message } from '../store/chatStore';
import { sendMessage } from '../services/greenApi';
import { useWindowSize } from '../hooks/useWindowSize';
import './ChatWindow.css';

interface ChatWindowProps {
  onToggleSidebar?: () => void;
}

export const ChatWindow = observer(({ onToggleSidebar }: ChatWindowProps) => {
  const selectedChat = chatStore.selectedChat;
  const messages = chatStore.selectedChatMessages;
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const { width } = useWindowSize();
  const isMobile = width <= 600;

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  );

  if (!selectedChat) {
    return (
      <div className="chat-window">
        <div className="chat-header">
          <button
            className="icon-button"
            onClick={() => isMobile ? onToggleSidebar?.() : chatStore.clearSelectedChat()}
            disabled={!isMobile}
          >
            {isMobile ? <ListIcon size={20} weight="bold" /> : <XIcon size={20} weight="bold" />}
          </button>
        </div>

        <div className="empty-state">
          <h2>Выберите чат</h2>
          <p>Выберите чат из списка или создайте новый</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedChat) return;

    const tempId = `temp-${Date.now()}`;
    const messageText = input.trim();

    startTransition(async () => {
      const optimisticMessage: Message = {
        id: tempId,
        text: messageText,
        timestamp: new Date(),
        isSent: true,
        isPending: true,
      };

      addOptimisticMessage(optimisticMessage);
      setInput('');

      try {
        const response = await sendMessage(selectedChat.id, messageText);

        chatStore.addMessage(selectedChat.id, {
          id: response.idMessage,
          text: messageText,
          timestamp: new Date(),
          isSent: true,
          isPending: false,
        });

        chatStore.updateMessage(selectedChat.id, tempId, { id: response.idMessage, isPending: false });
      } catch (error) {
        chatStore.updateMessage(selectedChat.id, tempId, { isPending: false });
        console.error('Failed to send message:', error);
      }
    });
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button
          className="icon-button"
          onClick={() => isMobile ? onToggleSidebar?.() : chatStore.clearSelectedChat()}
        >
          {isMobile ? <ListIcon size={20} weight="bold" /> : <XIcon size={20} weight="bold" />}
        </button>

        <div className="user-info">
          <h3 className="user-name">
            {selectedChat.username || `+${selectedChat.phoneNumber}`}
          </h3>
        </div>

        <Avatar className="user-avatar">
          {selectedChat.username ? selectedChat.username[1].toUpperCase() : '😎'}
        </Avatar>
      </div>

      <div className="chat-messages">
        {optimisticMessages.length === 0 ? (
          <div className="empty-chat-message">
            <p>Нет сообщений</p>
          </div>
        ) : (
          optimisticMessages.map((message) => (
            <div key={message.id} className={`message ${message.isSent ? 'message-sent' : ''}`}>
              <div className="message-content">
                <p>{message.text.split('\n').map((p, i) => <span key={i}>{i > 0 && <br />}{p}</span>)}</p>
                <div className="message-meta">
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.isPending && <span className="message-pending">...</span>}
                  {message.isSent && !message.isPending && <span className="message-check"><ChecksIcon size={20} weight="light" /></span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-area">
        <textarea
          placeholder="Написать сообщение..."
          className="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPending}
        />
        <button type="submit" className="send-button" disabled={isPending || !input.trim()}>
          <ArrowUpIcon size={20} weight="bold" />
        </button>
      </form>
    </div>
  );
});
