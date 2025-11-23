import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './page.css';

const Chat = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [messageType, setMessageType] = useState('text');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get access token from cookies
  const getAccessToken = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(c => c.startsWith('accessToken='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  // Initialize socket connection
  useEffect(() => {
    const token = getAccessToken();
    
    if (!token) {
      navigate('/');
      return;
    }

    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);

    // Connect to socket
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      newSocket.emit('users:online');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      alert('Failed to connect to chat. Please login again.');
      navigate('/');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [navigate]);

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/history?page=1&limit=100`,
          { credentials: 'include' }
        );
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data.data.messages || []);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchHistory();
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('message:new', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    socket.on('message:deleted', ({ messageId }) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    });

    socket.on('user:joined', ({ username, message }) => {
      console.log(message);
    });

    socket.on('user:left', ({ username, message }) => {
      console.log(message);
    });

    socket.on('user:typing', ({ username }) => {
      setTypingUsers(prev => [...new Set([...prev, username])]);
    });

    socket.on('user:stopped-typing', ({ userId }) => {
      setTypingUsers(prev => prev.filter(u => u !== userId));
    });

    socket.on('users:online-list', ({ users, count }) => {
      setOnlineUsers(users);
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off('message:new');
      socket.off('message:deleted');
      socket.off('user:joined');
      socket.off('user:left');
      socket.off('user:typing');
      socket.off('user:stopped-typing');
      socket.off('users:online-list');
      socket.off('error');
    };
  }, [socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!socket) return;

    if (messageType === 'text' && !inputMessage.trim()) return;
    
    if ((messageType === 'image' || messageType === 'video') && !mediaPreview) return;

    let messageData = {
      messageType,
      content: inputMessage.trim(),
    };

    // If media, include the URLs
    if (mediaPreview) {
      messageData.mediaUrl = mediaPreview.mediaUrl;
      messageData.mediaPublicId = mediaPreview.mediaPublicId;
    }

    socket.emit('message:send', messageData);

    // Reset input
    setInputMessage('');
    setMediaPreview(null);
    setMessageType('text');
    
    // Stop typing indicator
    socket.emit('typing:stop');
  };

  const handleTyping = (e) => {
    setInputMessage(e.target.value);

    if (!socket) return;

    // Start typing indicator
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing:start');
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing:stop');
    }, 2000);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Determine message type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    setUploadingMedia(true);

    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('messageType', isImage ? 'image' : 'video');

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/upload-media`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      setMediaPreview({
        mediaUrl: data.data.mediaUrl,
        mediaPublicId: data.data.mediaPublicId,
        type: data.data.messageType,
      });
      
      setMessageType(data.data.messageType);
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media. Please try again.');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/message/${messageId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Delete failed');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const cancelMediaPreview = () => {
    setMediaPreview(null);
    setMessageType('text');
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <button className="back-btn" onClick={() => navigate('/homepage')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="chat-header-info">
          <h1>Playistan Community</h1>
          <p className="online-count">
            <span className="pulse-dot"></span>
            {onlineUsers.length} members active
          </p>
        </div>

        <button className="online-users-btn" onClick={() => socket?.emit('users:online')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </header>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="no-messages">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3>No messages yet</h3>
            <p>Be the first to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`message ${msg.sender._id === currentUser._id ? 'message-own' : 'message-other'}`}
            >
              <div className="message-avatar">
                {msg.sender.username.charAt(0).toUpperCase()}
              </div>
              
              <div className="message-content">
                <div className="message-header">
                  <span className="message-username">{msg.sender.username}</span>
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>

                {msg.messageType === 'text' && (
                  <p className="message-text">{msg.content}</p>
                )}

                {msg.messageType === 'image' && (
                  <div className="message-media">
                    <img src={msg.mediaUrl} alt="Shared" />
                    {msg.content && <p className="message-text">{msg.content}</p>}
                  </div>
                )}

                {msg.messageType === 'video' && (
                  <div className="message-media">
                    <video controls src={msg.mediaUrl} />
                    {msg.content && <p className="message-text">{msg.content}</p>}
                  </div>
                )}

                {msg.sender._id === currentUser._id && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMessage(msg._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <span>{typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing</span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Media Preview */}
      {mediaPreview && (
        <div className="media-preview">
          <button className="cancel-media" onClick={cancelMediaPreview}>×</button>
          {mediaPreview.type === 'image' ? (
            <img src={mediaPreview.mediaUrl} alt="Preview" />
          ) : (
            <video src={mediaPreview.mediaUrl} controls />
          )}
        </div>
      )}

      {/* Input Area */}
      <form className="input-area" onSubmit={handleSendMessage}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,video/*"
          style={{ display: 'none' }}
        />

        <button
          type="button"
          className="attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingMedia}
        >
          {uploadingMedia ? (
            <div className="mini-spinner"></div>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          )}
        </button>

        <input
          type="text"
          className="message-input"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={handleTyping}
          disabled={uploadingMedia}
        />

        <button type="submit" className="send-btn" disabled={uploadingMedia}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;