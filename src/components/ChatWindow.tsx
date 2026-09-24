import {
  ArrowLeft,
  Phone,
  VideoCamera,
  MagnifyingGlass,
  ArrowUp
} from '@phosphor-icons/react';
import { Avatar } from '@radix-ui/react-avatar';
import { observer } from 'mobx-react-lite';
import { chatStore } from '../store/chatStore';
import './ChatWindow.css';

export const ChatWindow = observer(() => {
  const selectedChat = chatStore.selectedChat;

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
        <div className="empty-chat-message">
          <p>Нет сообщений</p>
        </div>
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Написать сообщение..."
          className="message-input"
        />
        <button className="send-button">
          <ArrowUp size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
});
