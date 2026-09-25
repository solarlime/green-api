import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import './Chat.css';

export function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="chat-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ChatWindow onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
}
