import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

interface Message {
  type: 'text' | 'image';
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

type TaskMode = 'Auto' | 'BrainMRI' | 'ChestX-ray' | 'Histopathology';

// Local storage helpers
const STORAGE_KEY = 'llava_medrag_chats';
const STORAGE_EXPIRY = 60 * 60 * 1000; // 1 hour

const loadChatsFromStorage = (): Chat[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const { chats, timestamp } = JSON.parse(stored);
    
    // Check if data is expired
    if (Date.now() - timestamp > STORAGE_EXPIRY) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    
    return chats;
  } catch {
    return [];
  }
};

const saveChatsToStorage = (chats: Chat[]) => {
  const data = {
    chats,
    timestamp: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

function App() {
  const [chats, setChats] = useState<Chat[]>(() => loadChatsFromStorage());
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<TaskMode>('Auto');
  const [isOnline, setIsOnline] = useState(false);

  const currentChat = chats.find(chat => chat.id === selectedChatId);
  const messages = currentChat?.messages || [];

  // Save chats to localStorage whenever they change
  useEffect(() => {
    saveChatsToStorage(chats);
  }, [chats]);

  // Check backend status
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://192.248.10.121:8000/status');
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (content: string, image?: string) => {
    if (!selectedChatId) {
      // Create new chat if none selected
      handleNewChat();
      return;
    }

    const userMessage: Message = {
      type: image ? 'image' : 'text',
      content: image || content,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Add user message to chat
    setChats(prev => prev.map(chat => 
      chat.id === selectedChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));

    // Prepare structured POST request
    const requestBody = {
      mode: selectedMode,
      message: {
        text: content,
        image: image || null,
        timestamp: userMessage.timestamp
      },
      history: {
        messages: currentChat?.messages || [],
        images: (currentChat?.messages || [])
          .filter(msg => msg.type === 'image')
          .map(msg => ({ content: msg.content, timestamp: msg.timestamp }))
      },
      chat_id: selectedChatId
    };

    try {
      // Send to FastAPI backend
      const response = await fetch('http://192.248.10.121:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          type: 'text',
          content: data.response || 'Response received',
          sender: 'bot',
          timestamp: new Date().toISOString()
        };

        // Add bot response
        setChats(prev => prev.map(chat => 
          chat.id === selectedChatId 
            ? { ...chat, messages: [...chat.messages, botMessage] }
            : chat
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        type: 'text',
        content: 'Error: Backend is offline. Please check connection.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setChats(prev => prev.map(chat => 
        chat.id === selectedChatId 
          ? { ...chat, messages: [...chat.messages, errorMessage] }
          : chat
      ));
    }
  };

  const handleNewChat = () => {
    // Find the highest existing Untitled Chat number
    const untitledChats = chats
      .map(c => c.title.match(/^Untitled Chat (\d+)$/))
      .filter(match => match !== null)
      .map(match => parseInt(match![1]));
    
    const nextNumber = untitledChats.length > 0 ? Math.max(...untitledChats) + 1 : 1;
    
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      title: `Untitled Chat ${nextNumber}`,
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    setChats([newChat, ...chats]);
    setSelectedChatId(newChat.id);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(null);
    }
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  // Create first chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      handleNewChat();
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar projectName="ClinVision AI" isOnline={isOnline} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          recentChats={chats}
          selectedChatId={selectedChatId}
          selectedMode={selectedMode}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onSelectMode={setSelectedMode}
        />
        <div style={{ flex: 1 }}>
          <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default App;
