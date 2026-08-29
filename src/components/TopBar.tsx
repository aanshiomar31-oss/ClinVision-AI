import React from 'react';

interface TopBarProps {
  projectName: string;
  isOnline: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ projectName, isOnline }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: '#1e1e1e',
      borderBottom: '1px solid #333',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#e0e0e0' }}>
          {projectName}
        </h2>
        <span style={{ fontSize: '16px', color: '#4fc3f7', fontWeight: '500' }}>
          Clinical Knowledge Assistant
        </span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: isOnline ? '#4caf50' : '#f44336'
        }} />
        <span style={{ fontSize: '14px', color: isOnline ? '#4caf50' : '#f44336' }}>
          {isOnline ? 'Backend Online' : 'Backend Offline'}
        </span>
      </div>
    </div>
  );
};

export default TopBar;
