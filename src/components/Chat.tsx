import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import './Chat.css';

export function Chat() {
  return (
    <div className="chat-container">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
