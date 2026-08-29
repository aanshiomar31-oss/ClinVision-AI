import React, { useState } from 'react';

interface Chat {
  id: string;
  title: string;
}

type TaskMode =
  | 'Auto'
  | 'BrainMRI'
  | 'ChestX-ray'
  | 'Histopathology'
  | 'ClinicalGuidelines';
interface SidebarProps {
  recentChats: Chat[];
  selectedChatId: string | null;
  selectedMode: TaskMode;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onSelectMode: (mode: TaskMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  recentChats, 
  selectedChatId, 
  selectedMode,
  onSelectChat, 
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onSelectMode
}) => {
  const modes: TaskMode[] = [
  'Auto',
  'BrainMRI',
  'ChestX-ray',
  'Histopathology',
  'ClinicalGuidelines'
];
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  return (
    <div style={{
      width: '280px',
      backgroundColor: '#0F172A',
      borderRight: '1px solid #1E293B',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* New Chat Button */}
      <div style={{ padding: '15px' }}>
        <button onClick={onNewChat} style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#14B8A6',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(20,184,166,0.25)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          + New Chat
        </button>
      </div>

      {/* Recent Chats */}
      <div style={{ padding: '0 15px', flex: 1, overflowY: 'auto' }}>
        <h3 style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>
          Recent Chats
        </h3>
        <div>
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '5px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: selectedChatId === chat.id ? '#1e3a5f' : 'transparent',
                transition: 'background-color 0.2s'
              }}
            >
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => {
                    if (editTitle.trim()) {
                      onRenameChat(chat.id, editTitle.trim());
                    }
                    setEditingChatId(null);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      if (editTitle.trim()) {
                        onRenameChat(chat.id, editTitle.trim());
                      }
                      setEditingChatId(null);
                    }
                  }}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    fontSize: '14px',
                    backgroundColor: '#2d2d30',
                    border: '1px solid #4fc3f7',
                    borderRadius: '4px',
                    color: '#e0e0e0',
                    outline: 'none'
                  }}
                />
              ) : (
                <>
                  <p 
                    onClick={() => onSelectChat(chat.id)}
                    style={{ margin: 0, fontSize: '14px', color: '#e0e0e0', flex: 1 }}
                  >
                    {chat.title}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingChatId(chat.id);
                      setEditTitle(chat.title);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4fc3f7',
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '4px 8px',
                      marginRight: '4px'
                    }}
                    title="Rename chat"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f44336',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px'
                    }}
                    title="Delete chat"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Task Mode Section */}
      <div style={{ padding: '15px', borderTop: '1px solid #333' }}>
        <h3 style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>
          Task Mode
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => onSelectMode(mode)}
              style={{
                padding: '10px 8px',
                backgroundColor: selectedMode === mode ? '#4fc3f7' : '#333',
                color: selectedMode === mode ? '#1e1e1e' : '#e0e0e0',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: selectedMode === mode ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              {mode === 'ClinicalGuidelines'
                    ? 'Clinical Guidelines'
                    : mode === 'BrainMRI'
                    ? 'Brain MRI'
                    : mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
