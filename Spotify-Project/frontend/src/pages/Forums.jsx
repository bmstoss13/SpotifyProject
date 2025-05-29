import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Forums.css';
import { getForums, getForum, createForum, replyToForum, likeForum, likeReply, getUserProfile } from '../services/api';
import { FaHeart, FaComment, FaRegHeart } from 'react-icons/fa';

const Forums = () => {
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForumTitle, setNewForumTitle] = useState('');
  const [newForumBody, setNewForumBody] = useState('');
  
  // Using hardcoded user ID for testing as in Inbox
  const currentUserId = "testUser1";
  
  // Cache for user profiles
  const userProfilesCache = useRef({});
  
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
      return { id: userId, profileName: userId };
    }
  }, []);

  const fetchForums = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getForums();
      const forumsData = response.data;
      
      // Fetch user profiles for forum creators and latest reply authors
      const userIds = new Set();
      forumsData.forEach(forum => {
        userIds.add(forum.createdBy);
        if (forum.latestReply && forum.latestReply.createdBy) {
          userIds.add(forum.latestReply.createdBy);
        }
      });
      
      await Promise.all(Array.from(userIds).map(id => fetchUserProfile(id)));
      
      // Format forums with user info
      const formattedForums = forumsData.map(forum => ({
        ...forum,
        createdByName: userProfilesCache.current[forum.createdBy]?.profileName || forum.createdBy,
        latestReplyAuthorName: forum.latestReply ? 
          (userProfilesCache.current[forum.latestReply.createdBy]?.profileName || forum.latestReply.createdBy) : null,
        timeAgo: formatTimeAgo(forum.createdAt)
      }));
      
      setForums(formattedForums);
    } catch (err) {
      console.error("Failed to fetch forums:", err);
      setError(err.message || 'Failed to load forums.');
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  const fetchForumDetails = useCallback(async (forumId) => {
    try {
      const response = await getForum(forumId);
      const { forum, replies } = response.data;
      
      // Fetch user profiles for reply authors
      const userIds = new Set([forum.createdBy]);
      replies.forEach(reply => userIds.add(reply.createdBy));
      
      await Promise.all(Array.from(userIds).map(id => fetchUserProfile(id)));
      
      // Format forum and replies with user info
      const formattedForum = {
        ...forum,
        createdByName: userProfilesCache.current[forum.createdBy]?.profileName || forum.createdBy,
        timeAgo: formatTimeAgo(forum.createdAt),
        isLikedByCurrentUser: forum.likedBy?.includes(currentUserId) || false,
        replies: replies.map(reply => ({
          ...reply,
          createdByName: userProfilesCache.current[reply.createdBy]?.profileName || reply.createdBy,
          timeAgo: formatTimeAgo(reply.createdAt),
          isLikedByCurrentUser: reply.likedBy?.includes(currentUserId) || false
        }))
      };
      
      setSelectedForum(formattedForum);
    } catch (err) {
      console.error("Failed to fetch forum details:", err);
      setError(err.message || 'Failed to load forum details.');
    }
  }, [fetchUserProfile, currentUserId]);

  useEffect(() => {
    fetchForums();
  }, [fetchForums]);

  const formatTimeAgo = (timestamp) => {
    const date = timestamp._seconds ? new Date(timestamp._seconds * 1000) : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleForumClick = (forum) => {
    fetchForumDetails(forum.id);
  };

  const handleCreateForum = async () => {
    if (!newForumTitle.trim() || !newForumBody.trim()) {
      alert('Please fill in both title and body');
      return;
    }
    
    try {
      const forumData = {
        title: newForumTitle.trim(),
        body: newForumBody.trim(),
        createdBy: currentUserId
      };
      
      await createForum(forumData);
      setNewForumTitle('');
      setNewForumBody('');
      setShowCreateModal(false);
      fetchForums(); // Refresh forum list
    } catch (err) {
      console.error("Failed to create forum:", err);
      alert("Error creating forum: " + (err.response?.data?.error || err.message));
    }
  };

  const handleSendReply = async (e) => {
    if (e.key === 'Enter' && newReply.trim() && selectedForum) {
      try {
        const replyData = {
          body: newReply.trim(),
          createdBy: currentUserId
        };
        
        await replyToForum(selectedForum.id, replyData);
        setNewReply('');
        fetchForumDetails(selectedForum.id); // Refresh forum details
        fetchForums(); // Refresh forum list to update reply count
      } catch (err) {
        console.error("Failed to send reply:", err);
        alert("Error sending reply: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      await likeReply(selectedForum.id, replyId, currentUserId);
      fetchForumDetails(selectedForum.id); // Refresh to get updated like count
    } catch (err) {
      console.error("Failed to like reply:", err);
    }
  };

  const handleLikeForum = async () => {
    try {
      await likeForum(selectedForum.id, currentUserId);
      fetchForumDetails(selectedForum.id); // Refresh to get updated like count
      fetchForums(); // Refresh forum list to update like count in sidebar
    } catch (err) {
      console.error("Failed to like forum:", err);
    }
  };

  if (loading && forums.length === 0) {
    return <div className="forums-container"><p>Loading forums...</p></div>;
  }
  
  if (error) {
    return <div className="forums-container"><p>Error: {error}</p></div>;
  }

  return (
    <div className="forums-container">
      {/* Sidebar */}
      <div className="forums-sidebar">
        <div className="forums-sidebar-header">
          <h1>Forums</h1>
          <button className="create-forum-btn" onClick={() => setShowCreateModal(true)}>
            Create Forum
          </button>
        </div>
        <hr />
        <div className="forums-thread-list-container">
          {forums.length === 0 && !loading && <p>No forums yet. Create the first one!</p>}
          
          {forums.map(forum => (
            <div 
              key={forum.id} 
              onClick={() => handleForumClick(forum)} 
              className={`forums-thread-item ${selectedForum && selectedForum.id === forum.id ? 'selected' : ''}`}
            >
              <div className="forums-thread-header">
                <h3 className="forums-thread-title">{forum.title}</h3>
                <span className="forums-thread-time">{forum.timeAgo}</span>
              </div>
              <p className="forums-thread-last-message">
                by {forum.createdByName}
                {forum.latestReply && (
                  <span> • Latest: {forum.latestReply.body.substring(0, 50)}
                    {forum.latestReply.body.length > 50 ? '...' : ''} by {forum.latestReplyAuthorName}
                  </span>
                )}
              </p>
              <div className="forums-thread-stats">
                <div className="forums-stat-item">
                  <FaHeart />
                  <span>{forum.likes || 0}</span>
                </div>
                <div className="forums-stat-item">
                  <FaComment />
                  <span>{forum.repliesCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forum Display Area */}
      <div className="forum-display-area">
        {selectedForum ? (
          <>
            <div className="forum-display-header">
              <div className="forum-header-top">
                <h2>{selectedForum.title}</h2>
                <button 
                  className={`like-btn ${selectedForum.isLikedByCurrentUser ? 'liked' : ''}`}
                  onClick={handleLikeForum}
                >
                  {selectedForum.isLikedByCurrentUser ? <FaHeart /> : <FaRegHeart />}
                  <span className="like-count">{selectedForum.likes || 0}</span>
                </button>
              </div>
              <div className="forum-display-meta">
                By {selectedForum.createdByName} • {selectedForum.timeAgo}
              </div>
            </div>
            <div className="forum-display-body">
              {selectedForum.body}
            </div>
            <hr />
            <div className="replies-list">
              <h3>Replies ({selectedForum.replies?.length || 0})</h3>
              {selectedForum.replies?.map(reply => (
                <div key={reply.id} className="reply-item">
                  <div className="reply-header">
                    <span className="reply-author">{reply.createdByName}</span>
                    <span className="reply-date">{reply.timeAgo}</span>
                  </div>
                  <div className="reply-body">{reply.body}</div>
                  <div className="reply-actions">
                    <button 
                      className={`like-btn ${reply.isLikedByCurrentUser ? 'liked' : ''}`}
                      onClick={() => handleLikeReply(reply.id)}
                    >
                      {reply.isLikedByCurrentUser ? <FaHeart /> : <FaRegHeart />}
                      <span className="like-count">{reply.likes || 0}</span>
                    </button>
                  </div>
                </div>
              ))}
              {(!selectedForum.replies || selectedForum.replies.length === 0) && 
                <p style={{textAlign: 'center', color: '#999', marginTop: '20px'}}>
                  No replies yet. Be the first to reply!
                </p>}
            </div>
            <hr />
            <div className="reply-input-area">
              <input 
                type="text" 
                placeholder={`Reply to this forum...`}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                onKeyPress={handleSendReply}
              />
            </div>
          </>
        ) : (
          <div className="no-forum-selected">
            Select a forum to view the discussion.
          </div>
        )}
      </div>

      {/* Create Forum Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Forum</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="forum-title">Title</label>
                <input
                  id="forum-title"
                  type="text"
                  value={newForumTitle}
                  onChange={(e) => setNewForumTitle(e.target.value)}
                  placeholder="Enter forum title..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="forum-body">Body</label>
                <textarea
                  id="forum-body"
                  value={newForumBody}
                  onChange={(e) => setNewForumBody(e.target.value)}
                  placeholder="Enter forum description..."
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateForum}>
                Create Forum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;
