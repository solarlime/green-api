import {
  ArrowLeft,
  Phone,
  VideoCamera,
  MagnifyingGlass,
  ArrowUp
} from '@phosphor-icons/react';
import { Avatar } from '@radix-ui/react-avatar';
import { observer } from 'mobx-react-lite';
import { useState, useOptimistic, useTransition, useEffect } from 'react';
import { chatStore, type Message } from '../store/chatStore';
import { sendMessage } from '../services/greenApi';
import './ChatWindow.css';

export const ChatWindow = observer(() => {
  const selectedChat = chatStore.selectedChat;
  const messages = chatStore.selectedChatMessages;
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (selectedChat) {
        chatStore.stopPolling(selectedChat.id);
      }
    };
  }, [selectedChat]);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  );

  if (!selectedChat) {
    return (
      <div className="chat-window">
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
        <button className="icon-button" onClick={() => chatStore.clearSelectedChat()}>
          <ArrowLeft size={20} weight="bold" />
        </button>

        <Avatar className="user-avatar">
          <div className="avatar-image">
            <div className="avatar-placeholder">
              {selectedChat.username ? selectedChat.username[0].toUpperCase() : selectedChat.phoneNumber.toString()[0]}
            </div>
          </div>
        </Avatar>

        <div className="user-info">
          <h3 className="user-name">
            {selectedChat.username || `+${selectedChat.phoneNumber}`}
          </h3>
          <p className="user-status">Telegram</p>
        </div>

        <div className="header-actions">
          <button className="icon-button">
            <Phone size={20} weight="regular" />
          </button>
          <button className="icon-button">
            <VideoCamera size={20} weight="regular" />
          </button>
          <button className="icon-button">
            <MagnifyingGlass size={20} weight="regular" />
          </button>
        </div>
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
                <p>{message.text}</p>
                <div className="message-meta">
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.isPending && <span className="message-pending">...</span>}
                  {message.isSent && !message.isPending && <span className="message-check">✓✓</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-area">
        <input
          type="text"
          placeholder="Написать сообщение..."
          className="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPending}
        />
        <button type="submit" className="send-button" disabled={isPending || !input.trim()}>
          <ArrowUp size={20} weight="bold" />
        </button>
      </form>
    </div>
  );
});
