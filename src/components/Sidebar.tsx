import {
  SignOut,
  Plus,
  CheckCircle

} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { authStore } from '../store/authStore';
import { chatStore } from '../store/chatStore';
import AddChatModal from './AddChatModal';
import './Sidebar.css';

export const Sidebar = observer(() => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    authStore.clearCredentials();
    navigate('/login');
  };
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Чаты</h2>
        <button className="icon-button" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} weight="bold" />
        </button>
      </div>

      <div className="chat-list">
        {chatStore.chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chatStore.selectedChatId === chat.id ? 'active' : ''}`}
            onClick={() => chatStore.selectChat(chat.id)}
          >
            <div className="chat-avatar">
              <div className="avatar-placeholder">
                {chat.username ? chat.username[0].toUpperCase() : chat.phoneNumber.toString()[0]}
              </div>
            </div>
            <div className="chat-info">
              <div className="chat-name-row">
                <span className="chat-name">
                  {chat.username || `+${chat.phoneNumber}`}
                </span>
                {chat.lastMessageTime && (
                  <span className="chat-time">{chat.lastMessageTime}</span>
                )}
              </div>
              <p className="chat-preview">
                {chat.lastMessage || 'Нет сообщений'}
              </p>
            </div>
            {chat.unreadCount && chat.unreadCount > 0 && (
              <span className="notification-badge">{chat.unreadCount}</span>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={handleLogout}>
          <SignOut size={20} weight="regular" />
          <span>Выйти</span>
        </button>
      </div>
      
      <AddChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
});
