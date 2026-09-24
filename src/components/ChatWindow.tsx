import {
  ArrowLeft,
  Phone,
  VideoCamera,
  MagnifyingGlass,
  ArrowUp
} from '@phosphor-icons/react';
import { Avatar } from '@radix-ui/react-avatar';
import './ChatWindow.css';

export function ChatWindow() {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="icon-button">
          <ArrowLeft size={20} weight="bold" />
        </button>

        <Avatar className="user-avatar">
          <div className="avatar-image dog-avatar" />
        </Avatar>

        <div className="user-info">
          <h3 className="user-name">Михаил Степашкин</h3>
          <p className="user-status">был(-а) в сети в 20:48 04 июн.</p>
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
        <div className="date-separator">
          <span>06 июня 2025 г.</span>
        </div>

        <div className="message message-sent">
          <div className="message-content">
            <p>Михаил, привет, как дела?:)</p>
            <div className="message-meta">
              <span className="message-time">16:43</span>
              <span className="message-check">✓✓</span>
            </div>
          </div>
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
}
