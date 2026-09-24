import {
  SignOut,
  Plus,
  CheckCircle

} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../store/authStore';
import './Sidebar.css';

export const Sidebar = observer(() => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.clearCredentials();
    navigate('/login');
  };
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Чаты</h2>
        <button className="icon-button">
          <Plus size={20} weight="bold" />
        </button>
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
        <button className="nav-item" onClick={handleLogout}>
          <SignOut size={20} weight="regular" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
});
