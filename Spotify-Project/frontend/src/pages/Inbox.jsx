import React, { useState } from 'react';
import './Inbox.css';

const Inbox = () => {
  const [selectedThread, setSelectedThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Fake data for now
  const threads = [
    { 
      id: 1, 
      name: 'Alice', 
      lastMessage: 'Hey, how are you?', 
      time: '10:30 AM', 
      messages: [
        {sender: 'Alice', text: 'Hey, how are you?', timestamp: '10:30 AM'},
        {sender: 'Me', text: 'I am good, thanks! How about you?', timestamp: '10:31 AM'}
      ] 
    },
    { 
      id: 2, 
      name: 'Bob', 
      lastMessage: 'Meeting at 2 PM', 
      time: 'Yesterday', 
      messages: [
        {sender: 'Bob', text: 'Meeting at 2 PM', timestamp: '1:45 PM'},
        {sender: 'Me', text: 'Sounds good.', timestamp: '1:46 PM'}
      ] 
    },
    { 
      id: 3, 
      name: 'Charlie', 
      lastMessage: 'Check this out!', 
      time: 'Mon', 
      messages: [
        {sender: 'Charlie', text: 'Check this out!', timestamp: '3:20 PM'},
        {sender: 'Me', text: 'Wow, cool!', timestamp: '3:21 PM'}
      ] 
    },
  ];

  const handleThreadClick = (thread) => {
    setSelectedThread(thread);
  };

  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && newMessage.trim()) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newMsg = {
        sender: 'Me',
        text: newMessage.trim(),
        timestamp: timestamp
      };

      // Update the selected thread with the new message
      const updatedThread = {
        ...selectedThread,
        messages: [...selectedThread.messages, newMsg],
        lastMessage: newMessage.trim(),
        time: 'Just now'
      };

      // Update the thread in the threads array
      const updatedThreads = threads.map(thread => 
        thread.id === selectedThread.id ? updatedThread : thread
      );

      setSelectedThread(updatedThread);
      setNewMessage('');
    }
  };

  return (
    <div className="inbox-container">
      {/* Sidebar */}
      <div className="inbox-sidebar">
        <div className="inbox-sidebar-header">
          <h1>Index</h1>
        </div>
        <hr />
        <input type="text" placeholder="Search messages..." className="inbox-sidebar-search" />
        <div className="inbox-thread-list-container">
          {threads.map(thread => (
            <div 
              key={thread.id} 
              onClick={() => handleThreadClick(thread)} 
              className={`inbox-thread-item ${selectedThread && selectedThread.id === thread.id ? 'selected' : ''}`}
            >
              <div className="inbox-thread-header">
                <strong className="inbox-thread-name">{thread.name}</strong>
                <span className="inbox-thread-time">{thread.time}</span>
              </div>
              <p className="inbox-thread-last-message">{thread.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Message Display Area */}
      <div className="message-display-area">
        {selectedThread ? (
          <>
            <div className="message-display-header">
              <h2>{selectedThread.name}</h2>
              <p className="message-display-status">online</p>
            </div>
            <hr />
            <div className="message-list">
              {selectedThread.messages.map((msg, index) => {
                const isSameSender = index > 0 && 
                  selectedThread.messages[index - 1].sender === msg.sender;
                
                return (
                  <div 
                    key={index} 
                    className={`message-bubble ${msg.sender === 'Me' ? 'sent' : 'received'} ${isSameSender ? 'same-sender' : ''}`}
                  >
                    {msg.text}
                    <span className="message-timestamp">{msg.timestamp}</span>
                  </div>
                );
              })}
            </div>
            <hr />
            <div className="message-input-area">
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleSendMessage}
              />
            </div>
          </>
        ) : (
          <div className="no-thread-selected">
            Select a conversation to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
