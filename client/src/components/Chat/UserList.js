import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const UserList = ({ users, onlineUsers, selectedUser, onUserSelect }) => {
  const isUserOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Messages</h3>
      </div>
      <div className="user-list-items">
        {users.map(user => (
          <div
            key={user._id}
            className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
            onClick={() => onUserSelect(user)}
          >
            <div className="user-avatar-container">
              <img src={user.avatar} alt={user.username} className="user-avatar" />
              <span className={`status-indicator ${isUserOnline(user._id) ? 'online' : 'offline'}`}></span>
            </div>
            <div className="user-info">
              <h4>{user.username}</h4>
              <p className="user-status">
                {isUserOnline(user._id) ? (
                  <span className="online-text">Online</span>
                ) : (
                  <span className="offline-text">
                    {user.lastSeen ? `Last seen ${formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true })}` : 'Offline'}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
