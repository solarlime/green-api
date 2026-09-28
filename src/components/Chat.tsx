import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { useWindowSize } from '../hooks/useWindowSize';
import './Chat.css';

export function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 600;

  return (
    <div className="chat-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
      <ChatWindow onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
}
