import {
  SignOutIcon,
  PlusIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { authStore } from '../store/authStore';
import { chatStore } from '../store/chatStore';
import AddChatModal from './AddChatModal';
import { useWindowSize } from '../hooks/useWindowSize';
import './Sidebar.css';
import { Avatar } from "@radix-ui/react-avatar";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = observer(({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 600;

  const handleLogout = () => {
    authStore.clearCredentials();
    navigate('/login');
  };

  const handleChatClick = (chatId: string) => {
    chatStore.selectChat(chatId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isMobile ? 'sidebar-mobile' : ''} ${isMobile && !isOpen ? 'sidebar-hidden' : ''}`}>
      <div className="sidebar-header">
        <h2>Чаты</h2>
        <button className="icon-button" onClick={() => setIsModalOpen(true)}>
          <PlusIcon size={20} weight="bold" />
        </button>
        {isMobile && onClose && (
          <button className="icon-button" onClick={onClose}>
            <XIcon size={20} weight="bold" />
          </button>
        )}
      </div>

      <div className="chat-list">
        {chatStore.chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chatStore.selectedChatId === chat.id ? 'active' : ''}`}
            onClick={() => handleChatClick(chat.id)}
          >
            <Avatar className="user-avatar">
              <div className="avatar-placeholder">
                {chat.username ? chat.username[1].toUpperCase() : '😎'}
              </div>
            </Avatar>
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
          <SignOutIcon size={20} weight="regular" />
          <span>Выйти</span>
        </button>
      </div>

      <AddChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
});
