import {
  ChatsCircle,
  ChatCircleText,
  User,
  Phone,
  Gear,
  MagnifyingGlass,
  Plus,
  CheckCircle
} from '@phosphor-icons/react';
import './Sidebar.css';

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Чаты</h2>
        <button className="icon-button">
          <Plus size={20} weight="bold" />
        </button>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active">
          <ChatsCircle size={20} weight="regular" />
          <span>Все</span>
        </button>
        <button className="nav-item">
          <ChatCircleText size={20} weight="regular" />
          <span>Новые</span>
          <span className="badge">1</span>
        </button>
        <button className="nav-item">
          <User size={20} weight="regular" />
          <span>Контакты</span>
        </button>
        <button className="nav-item">
          <Phone size={20} weight="regular" />
          <span>Звонки</span>
        </button>
      </nav>

      <div className="sidebar-search">
        <MagnifyingGlass size={18} weight="regular" className="search-icon" />
        <input type="text" placeholder="Поиск" />
      </div>

      <div className="chat-list">
        <div className="chat-item active">
          <div className="chat-avatar">
            <div className="avatar-placeholder">M</div>
            <CheckCircle size={14} weight="fill" className="verified-badge" />
          </div>
          <div className="chat-info">
            <div className="chat-name-row">
              <span className="chat-name">MAX</span>
              <span className="chat-time">16:39</span>
            </div>
            <p className="chat-preview">
              Начать общаться в MAX просто: найдите человека по номеру...
            </p>
          </div>
          <span className="notification-badge">2</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Gear size={20} weight="regular" />
          <span>Настройки</span>
        </button>
      </div>
    </div>
  );
}
