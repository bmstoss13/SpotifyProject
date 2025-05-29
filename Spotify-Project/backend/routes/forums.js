const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// GET all forums
router.get('/', async (req, res) => {
  try {
    const forumsSnapshot = await db.collection('forums').orderBy('likes', 'desc').get();
    const forums = [];
    
    for (const doc of forumsSnapshot.docs) {
      const forumData = { id: doc.id, ...doc.data() };
      
      // Get replies count and latest reply
      const repliesSnapshot = await db.collection('forums').doc(doc.id).collection('replies').orderBy('createdAt', 'desc').get();
      const repliesCount = repliesSnapshot.size;
      
      let latestReply = null;
      if (!repliesSnapshot.empty) {
        const latestReplyDoc = repliesSnapshot.docs[0];
        latestReply = {
          id: latestReplyDoc.id,
          ...latestReplyDoc.data()
        };
      }
      
      forums.push({
        ...forumData,
        repliesCount,
        latestReply
      });
    }
    
    res.status(200).json(forums);
  } catch (error) {
    console.error("Error fetching forums:", error);
    res.status(500).json({ error: 'Failed to fetch forums' });
  }
});

// GET a specific forum with its replies
router.get('/:forumId', async (req, res) => {
  try {
    const forumId = req.params.forumId;
    
    // Get the forum
    const forumDoc = await db.collection('forums').doc(forumId).get();
    if (!forumDoc.exists) {
      return res.status(404).json({ error: 'Forum not found' });
    }
    
    const forumData = { id: forumDoc.id, ...forumDoc.data() };
    
    // Get all replies for this forum
    const repliesSnapshot = await db.collection('forums').doc(forumId).collection('replies').orderBy('createdAt', 'asc').get();
    const replies = repliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json({
      forum: forumData,
      replies
    });
  } catch (error) {
    console.error("Error fetching forum:", error);
    res.status(500).json({ error: 'Failed to fetch forum' });
  }
});

// POST create a new forum
router.post('/', async (req, res) => {
  try {
    const { title, body, createdBy } = req.body;
    
    if (!title || !body || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields (title, body, createdBy)' });
    }
    
    const forumData = {
      title,
      body,
      createdBy,
      createdAt: new Date(),
      likes: 0,
      likedBy: []
    };
    
    const docRef = await db.collection('forums').add(forumData);
    
    res.status(201).json({ id: docRef.id, ...forumData });
  } catch (error) {
    console.error("Error creating forum:", error);
    res.status(500).json({ error: 'Failed to create forum' });
  }
});

// POST add a reply to a forum
router.post('/:forumId/replies', async (req, res) => {
  try {
    const forumId = req.params.forumId;
    const { body, createdBy } = req.body;
    
    if (!body || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields (body, createdBy)' });
    }
    
    // Check if forum exists
    const forumDoc = await db.collection('forums').doc(forumId).get();
    if (!forumDoc.exists) {
      return res.status(404).json({ error: 'Forum not found' });
    }
    
    const replyData = {
      body,
      createdBy,
      createdAt: new Date(),
      likes: 0,
      likedBy: []
    };
    
    const docRef = await db.collection('forums').doc(forumId).collection('replies').add(replyData);
    
    res.status(201).json({ id: docRef.id, ...replyData });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// POST like/unlike a forum
router.post('/:forumId/like', async (req, res) => {
  try {
    const forumId = req.params.forumId;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const forumRef = db.collection('forums').doc(forumId);
    const forumDoc = await forumRef.get();
    
    if (!forumDoc.exists) {
      return res.status(404).json({ error: 'Forum not found' });
    }
    
    const forumData = forumDoc.data();
    const likedBy = forumData.likedBy || [];
    const isLiked = likedBy.includes(userId);
    
    let updatedLikedBy, updatedLikes;
    
    if (isLiked) {
      // Unlike
      updatedLikedBy = likedBy.filter(id => id !== userId);
      updatedLikes = Math.max(0, (forumData.likes || 0) - 1);
    } else {
      // Like
      updatedLikedBy = [...likedBy, userId];
      updatedLikes = (forumData.likes || 0) + 1;
    }
    
    await forumRef.update({
      likes: updatedLikes,
      likedBy: updatedLikedBy
    });
    
    res.status(200).json({
      likes: updatedLikes,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error("Error liking forum:", error);
    res.status(500).json({ error: 'Failed to like forum' });
  }
});

// POST like/unlike a reply
router.post('/:forumId/replies/:replyId/like', async (req, res) => {
  try {
    const { forumId, replyId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    
    const replyRef = db.collection('forums').doc(forumId).collection('replies').doc(replyId);
    const replyDoc = await replyRef.get();
    
    if (!replyDoc.exists) {
      return res.status(404).json({ error: 'Reply not found' });
    }
    
    const replyData = replyDoc.data();
    const likedBy = replyData.likedBy || [];
    const isLiked = likedBy.includes(userId);
    
    let updatedLikedBy, updatedLikes;
    
    if (isLiked) {
      // Unlike
      updatedLikedBy = likedBy.filter(id => id !== userId);
      updatedLikes = Math.max(0, (replyData.likes || 0) - 1);
    } else {
      // Like
      updatedLikedBy = [...likedBy, userId];
      updatedLikes = (replyData.likes || 0) + 1;
    }
    
    await replyRef.update({
      likes: updatedLikes,
      likedBy: updatedLikedBy
    });
    
    res.status(200).json({
      likes: updatedLikes,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error("Error liking reply:", error);
    res.status(500).json({ error: 'Failed to like reply' });
  }
});

module.exports = router; 