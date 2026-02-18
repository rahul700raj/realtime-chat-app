import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { FiSend } from 'react-icons/fi';

const ChatWindow = ({ selectedUser, messages, onSendMessage, currentUser, socket }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('user-typing', ({ userId, isTyping }) => {
      if (userId === selectedUser._id) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket.off('user-typing');
    };
  }, [socket, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!socket) return;

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Emit typing start
    socket.emit('typing', {
      receiverId: selectedUser._id,
      isTyping: true
    });

    // Set timeout to emit typing stop
    const timeout = setTimeout(() => {
      socket.emit('typing', {
        receiverId: selectedUser._id,
        isTyping: false
      });
    }, 1000);

    setTypingTimeout(timeout);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Stop typing indicator
      if (socket) {
        socket.emit('typing', {
          receiverId: selectedUser._id,
          isTyping: false
        });
      }
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="chat-user-info">
          <img src={selectedUser.avatar} alt={selectedUser.username} />
          <div>
            <h3>{selectedUser.username}</h3>
            {isTyping && <span className="typing-indicator">typing...</span>}
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => {
          const isSender = msg.sender._id === currentUser.id;
          
          return (
            <div key={index} className={`message ${isSender ? 'sent' : 'received'}`}>
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="message-time">
                  {format(new Date(msg.createdAt), 'HH:mm')}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="message-input-container">
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button" disabled={!message.trim()}>
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
