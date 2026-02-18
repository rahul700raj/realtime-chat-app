import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import api from '../../config/api';
import './Chat.css';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const { user, logout } = useAuth();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (message) => {
      if (selectedUser && 
          (message.sender._id === selectedUser._id || message.receiver._id === selectedUser._id)) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('message-sent', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('receive-message');
      socket.off('message-sent');
    };
  }, [socket, selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    fetchMessages(selectedUser._id);
  };

  const handleSendMessage = (content) => {
    if (!socket || !selectedUser) return;

    socket.emit('send-message', {
      receiverId: selectedUser._id,
      content
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header">
          <div className="user-profile">
            <img src={user.avatar} alt={user.username} />
            <div>
              <h3>{user.username}</h3>
              <span className="status-online">Online</span>
            </div>
          </div>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
        <UserList 
          users={users}
          onlineUsers={onlineUsers}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
        />
      </div>
      <div className="chat-main">
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={user}
            socket={socket}
          />
        ) : (
          <div className="no-chat-selected">
            <h2>Welcome to Chat App</h2>
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
