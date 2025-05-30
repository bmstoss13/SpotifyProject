import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Inbox.css';
import { getInboxThreads, sendMessage, searchUsers, getUserProfile } from '../services/api'; // Import API functions
import { useAuth } from '../components/AuthContext'; // To get current user ID
import { getSpotifyProfile } from '../services/spotify'; // To get current user profile
import { useLocation } from 'react-router-dom';

// Debounce utility
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

const Inbox = () => {
  const [threads, setThreads] = useState([]); // Changed from fake data
  const [selectedThread, setSelectedThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // For users found via search
  const [isSearching, setIsSearching] = useState(false); // To distinguish search mode
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const location = useLocation();

  // Get access token from AuthContext
  const { accessToken } = useAuth();

  // Fetch current user ID when component mounts or access token changes
  useEffect(() => {
    const fetchCurrentUserId = async () => {
      if (!accessToken) {
        setCurrentUserId(null);
        setError("Please log in to view your messages.");
        setLoading(false);
        return;
      }

      try {
        setUserLoading(true);
        const spotifyProfile = await getSpotifyProfile(accessToken);
        setCurrentUserId(spotifyProfile.id);
        console.log("Inbox: Using currentUserId:", spotifyProfile.id);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setCurrentUserId(null);
        setError("Failed to get user information. Please try logging in again.");
        setLoading(false);
      } finally {
        setUserLoading(false);
      }
    };

    fetchCurrentUserId();
  }, [accessToken]);

  // Helper to fetch user profiles (can be memoized or moved to a context/cache)
  const userProfilesCache = useRef({}); // Simple cache for user profiles
  const fetchUserProfile = useCallback(async (userId) => {
    if (userProfilesCache.current[userId]) {
      return userProfilesCache.current[userId];
    }
    try {
      const response = await getUserProfile(userId);
      userProfilesCache.current[userId] = response.data;
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch profile for ${userId}:`, err);
      return { id: userId, profileName: userId }; // Fallback
    }
  }, []);

  const fetchThreadsAndUserNames = useCallback(async () => {
    if (!currentUserId) {
      console.error("Inbox: currentUserId is not set!");
      setError("User ID not found. Cannot load messages.");
      setLoading(false);
      return;
    }
    console.log("Inbox: Starting fetchThreads for user:", currentUserId);
    setLoading(true);
    setError(null);
    try {
      const response = await getInboxThreads(currentUserId);
      const rawMessages = response.data;
      if (!Array.isArray(rawMessages)) {
        console.error("Inbox: rawMessages is not an array:", rawMessages);
        setError("Received invalid message data.");
        setThreads([]);
        return;
      }
      if (rawMessages.length === 0) {
        console.log("Inbox: No messages found for this user.");
        setThreads([]);
        return;
      }

      const participantIds = new Set();
      rawMessages.forEach(msg => {
        participantIds.add(msg.senderId);
        participantIds.add(msg.recipientId);
      });

      await Promise.all(Array.from(participantIds).map(id => fetchUserProfile(id)));

      const groupedByParticipant = rawMessages.reduce((acc, msg) => {
        const otherParticipantId = msg.senderId === currentUserId ? msg.recipientId : msg.senderId;
        const otherUserInfo = userProfilesCache.current[otherParticipantId] || { profileName: otherParticipantId };
        
        if (!acc[otherParticipantId]) {
          acc[otherParticipantId] = {
            id: otherParticipantId,
            name: otherUserInfo.profileName,
            messages: [],
            latestMessageTimestamp: msg.timestamp,
          };
        }
        // Update latestMessageTimestamp
        const currentMsgDate = msg.timestamp._seconds ? new Date(msg.timestamp._seconds * 1000) : new Date(msg.timestamp);
        const latestKnownDate = acc[otherParticipantId].latestMessageTimestamp._seconds ? new Date(acc[otherParticipantId].latestMessageTimestamp._seconds * 1000) : new Date(acc[otherParticipantId].latestMessageTimestamp);
        if (currentMsgDate > latestKnownDate) {
            acc[otherParticipantId].latestMessageTimestamp = msg.timestamp;
        }

        acc[otherParticipantId].messages.push({
          id: msg.id,
          sender: msg.senderId === currentUserId ? 'Me' : (userProfilesCache.current[msg.senderId]?.profileName || msg.senderId),
          text: msg.body || '',
          originalTimestamp: msg.timestamp,
          timestamp: msg.timestamp ? new Date(currentMsgDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Invalid date'
        });
        return acc;
      }, {});

      const formattedThreads = Object.values(groupedByParticipant).map(thread => {
        thread.messages.sort((a, b) => {
          const dateA = a.originalTimestamp._seconds ? new Date(a.originalTimestamp._seconds * 1000) : new Date(a.originalTimestamp);
          const dateB = b.originalTimestamp._seconds ? new Date(b.originalTimestamp._seconds * 1000) : new Date(b.originalTimestamp);
          return dateA - dateB;
        });
        const lastMsg = thread.messages[thread.messages.length - 1];
        return { ...thread, lastMessage: lastMsg ? lastMsg.text : 'No messages', time: lastMsg ? lastMsg.timestamp : '' };
      });

      formattedThreads.sort((a, b) => {
        const dateA = a.latestMessageTimestamp._seconds ? new Date(a.latestMessageTimestamp._seconds * 1000) : new Date(a.latestMessageTimestamp);
        const dateB = b.latestMessageTimestamp._seconds ? new Date(b.latestMessageTimestamp._seconds * 1000) : new Date(b.latestMessageTimestamp);
        return dateB - dateA;
      });
      setThreads(formattedThreads);
    } catch (err) {
      console.error("Inbox: Failed to fetch threads:", err);
      setError(err.message || 'Failed to load messages.');
    } finally {
      console.log("Inbox: fetchThreads finished.");
      setLoading(false);
    }
  }, [currentUserId, fetchUserProfile]);

  useEffect(() => {
    // Only fetch threads if we have a current user ID and user is not loading
    if (currentUserId && !userLoading) {
      fetchThreadsAndUserNames();
    } else if (!userLoading && !currentUserId) {
      // User is loaded but no user ID available (not authenticated)
      setError("Please log in to view your messages.");
      setLoading(false);
    }
  }, [fetchThreadsAndUserNames, currentUserId, userLoading]);
  
  // Debounced search function
  const debouncedSearch = useCallback(debounce(async (query) => {
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setLoadingSearch(true);
    try {
      const response = await searchUsers(query);
      // Filter out the current user from search results
      setSearchResults(response.data.filter(user => user.id !== currentUserId)); 
    } catch (err) {
      console.error("Failed to search users:", err);
      setError("Failed to search users."); // Show error specific to search
    } finally {
      setLoadingSearch(false);
    }
  }, 500), [currentUserId]);

  useEffect(() => {
    if (location.state && location.state.profileName){
      const { profileName } = location.state;
      setSearchQuery(profileName);
      debouncedSearch(profileName);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, debouncedSearch])

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleThreadClick = (thread) => {
    console.log("Inbox: Thread clicked:", thread);
    setSelectedThread(thread);
    setSearchQuery(''); // Clear search when a thread is clicked
    setSearchResults([]);
    setIsSearching(false);
  };
  
  const handleSearchedUserClick = (user) => {
    // Check if a thread already exists for this user
    const existingThread = threads.find(t => t.id === user.id);
    if (existingThread) {
      setSelectedThread(existingThread);
    } else {
      // Create a temporary new thread structure for the selected user
      setSelectedThread({
        id: user.id,       // This is the other user's ID
        name: user.profileName || user.id, // Searched user's name
        messages: [],      // No messages yet
        lastMessage: 'Start a conversation!',
        time: ''
        // latestMessageTimestamp will be set when first message is sent/received
      });
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage.trim() && selectedThread && selectedThread.id) {
      console.log("Inbox: Sending message...");
      const recipientId = selectedThread.id;
      
      const messageData = {
        senderId: currentUserId,
        recipientId: recipientId,
        subject: selectedThread.subject || `Message to ${selectedThread.name || recipientId}`,
        body: newMessage.trim(),
      };
      console.log("Inbox: Message data to send:", messageData);

      try {
        const response = await sendMessage(recipientId, messageData);
        console.log("Inbox: Send message API response:", response);
        const sentMessage = response.data;

        const newMsgForUI = {
          id: sentMessage.id,
          sender: 'Me',
          text: sentMessage.body,
          timestamp: sentMessage.timestamp ? 
            new Date(sentMessage.timestamp._seconds ? sentMessage.timestamp._seconds * 1000 + sentMessage.timestamp._nanoseconds / 1000000 : sentMessage.timestamp)
            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : 'Invalid date'
        };

        const updatedThread = {
          ...selectedThread,
          messages: [...selectedThread.messages, newMsgForUI],
          lastMessage: newMsgForUI.text,
          time: 'Just now'
        };

        const updatedThreads = threads.map(t => 
          t.id === selectedThread.id ? updatedThread : t
        );
        
        const finalThreads = [updatedThread, ...updatedThreads.filter(t => t.id !== selectedThread.id)];

        setThreads(finalThreads);
        setSelectedThread(updatedThread);
        setNewMessage('');
        console.log("Inbox: Message sent and UI updated.");
      } catch (err) {
        console.error("Inbox: Failed to send message:", err);
        alert("Error sending message: " + (err.response?.data?.error || err.message));
      }
    }
  };

  // Handle send button click
  const handleSendButtonClick = async () => {
    if (newMessage.trim() && selectedThread && selectedThread.id) {
      console.log("Inbox: Sending message via button...");
      const recipientId = selectedThread.id;
      
      const messageData = {
        senderId: currentUserId,
        recipientId: recipientId,
        subject: selectedThread.subject || `Message to ${selectedThread.name || recipientId}`,
        body: newMessage.trim(),
      };
      console.log("Inbox: Message data to send:", messageData);

      try {
        const response = await sendMessage(recipientId, messageData);
        console.log("Inbox: Send message API response:", response);
        const sentMessage = response.data;

        const newMsgForUI = {
          id: sentMessage.id,
          sender: 'Me',
          text: sentMessage.body,
          timestamp: sentMessage.timestamp ? 
            new Date(sentMessage.timestamp._seconds ? sentMessage.timestamp._seconds * 1000 + sentMessage.timestamp._nanoseconds / 1000000 : sentMessage.timestamp)
            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : 'Invalid date'
        };

        const updatedThread = {
          ...selectedThread,
          messages: [...selectedThread.messages, newMsgForUI],
          lastMessage: newMsgForUI.text,
          time: 'Just now'
        };

        const updatedThreads = threads.map(t => 
          t.id === selectedThread.id ? updatedThread : t
        );
        
        const finalThreads = [updatedThread, ...updatedThreads.filter(t => t.id !== selectedThread.id)];

        setThreads(finalThreads);
        setSelectedThread(updatedThread);
        setNewMessage('');
        console.log("Inbox: Message sent and UI updated.");
      } catch (err) {
        console.error("Inbox: Failed to send message:", err);
        alert("Error sending message: " + (err.response?.data?.error || err.message));
      }
    }
  };

  // Render logic with checks for loading, error, and no threads
  if ((loading && threads.length === 0) || userLoading) {
    console.log("Inbox: Rendering primary loading state (initial load or full refresh).");
    return <div className="inbox-container"><p>Loading messages...</p></div>;
  }
  
  if (error && !loadingSearch) {
    console.error("Inbox: Rendering error state:", error);
    return <div className="inbox-container"><p>Error: {error}</p></div>;
  }

  // Determine what to display in the sidebar: search results or message threads
  const listToDisplay = isSearching && searchQuery ? searchResults : threads;

  // If not searching and done loading threads but no threads exist
  if (!isSearching && !loading && threads.length === 0) {
    console.log("Inbox: Rendering no threads state (after loading).");
    return (
      <div className="inbox-container">
        <div className="inbox-sidebar">
            <div className="inbox-sidebar-header">
              <h1>Inbox</h1>
            </div>
            <hr />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="inbox-sidebar-search" 
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="inbox-thread-list-container">
                <p>No conversations yet.</p>
            </div>
        </div>
        <div className="message-display-area">
          <div className="no-thread-selected">
            No messages. Start a new conversation!
          </div>
        </div>
      </div>
    );
  }
  
  console.log("Inbox: Rendering main layout with threads/search results:", listToDisplay);
  return (
    <div className="inbox-container">
      {/* Sidebar */}
      <div className="inbox-sidebar">
        <div className="inbox-sidebar-header"><h1>Inbox</h1></div>
        <hr />
        <input 
          type="text" 
          placeholder="Search users..." 
          className="inbox-sidebar-search" 
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="inbox-thread-list-container">
          {loadingSearch && <p>Searching users...</p>}
          {!loadingSearch && listToDisplay.length === 0 && searchQuery && <p>No users found for "{searchQuery}".</p>}
          {!loadingSearch && listToDisplay.length === 0 && !searchQuery && !loading && <p>No conversations yet.</p>}
          
          {listToDisplay.map(item => (
            isSearching && searchQuery ? (
              // Displaying searched users
              <div 
                key={item.id} 
                onClick={() => handleSearchedUserClick(item)} 
                className={`inbox-thread-item ${selectedThread && selectedThread.id === item.id ? 'selected-search-item' : ''}`}
              >
                <strong className="inbox-thread-name">{item.profileName || item.id}</strong>
                {/* Optionally show a small message if a thread exists or "Start conversation" */}
                {threads.find(t => t.id === item.id) ? 
                    <p className="inbox-thread-last-message"><i>Conversation exists</i></p> : 
                    <p className="inbox-thread-last-message"><i>Click to message</i></p>}
              </div>
            ) : (
              // Displaying message threads (item is a thread object here)
              <div 
                key={item.id} 
                onClick={() => handleThreadClick(item)} 
                className={`inbox-thread-item ${selectedThread && selectedThread.id === item.id ? 'selected' : ''}`}
              >
                <div className="inbox-thread-header">
                  <strong className="inbox-thread-name">{item.name}</strong>
                  <span className="inbox-thread-time">{item.time}</span>
                </div>
                <p className="inbox-thread-last-message">{item.lastMessage}</p>
              </div>
            )
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
                // Ensure msg and msg.sender are defined before comparing
                const isSameSender = index > 0 && 
                  selectedThread.messages[index - 1] && 
                  selectedThread.messages[index - 1].sender === (msg && msg.sender);
                
                if (!msg) return null; // Skip rendering if msg is undefined

                return (
                  <div 
                    key={msg.id}
                    className={`message-bubble ${msg.sender === 'Me' ? 'sent' : 'received'} ${isSameSender ? 'same-sender' : ''}`}
                  >
                    {msg.text}
                    <span className="message-timestamp">{msg.timestamp}</span>
                  </div>
                );
              })}
              {(!selectedThread.messages || selectedThread.messages.length === 0) && 
                <p className="no-messages-in-thread">No messages yet. Say hello!</p>}
            </div>
            <hr />
            <div className="message-input-area">
              <input 
                type="text" 
                placeholder={`Message ${selectedThread.name || selectedThread.id}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleSendMessage}
                disabled={!selectedThread.id} // Disable if no user/thread selected for messaging
              />
              <button 
                className="send-button"
                onClick={handleSendButtonClick}
                disabled={!selectedThread.id || !newMessage.trim()}
                title="Send message"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="no-thread-selected">
            Select a conversation or search for a user to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
