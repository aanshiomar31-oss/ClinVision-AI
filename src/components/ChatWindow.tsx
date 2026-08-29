import React, { useState, useRef } from 'react';

interface Message {
  type: 'text' | 'image';
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string, image?: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (input.trim() || selectedImage) {
      onSendMessage(input, selectedImage || undefined);
      setInput('');
      setSelectedImage(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#1e1e1e'
    }}>
      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#888'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>💬</div>
            <p>Welcome to LLaVA-MedRAG! Start a conversation</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: msg.sender === 'user' ? '#4fc3f7' : '#2d2d30',
                color: msg.sender === 'user' ? '#1e1e1e' : '#e0e0e0'
              }}>
                {msg.type === 'text' ? (
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{msg.content}</p>
                ) : (
                  <img src={msg.content} alt="Chat" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Container */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #333',
        backgroundColor: '#252526'
      }}>
        {selectedImage && (
          <div style={{ marginBottom: '10px', position: 'relative', display: 'inline-block' }}>
            <img src={selectedImage} alt="Selected" style={{ maxHeight: '100px', borderRadius: '8px' }} />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '12px',
              backgroundColor: '#333',
              color: '#4fc3f7',
              border: 'none',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '18px'
            }}
            title="Upload image"
          >
            📎
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #333',
              borderRadius: '24px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#2d2d30',
              color: '#e0e0e0'
            }}
          />
          <button
            onClick={handleSend}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4fc3f7',
              color: '#1e1e1e',
              border: 'none',
              borderRadius: '24px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
