const express = require('express');
const router = express.Router();
const { db } = require('../firebase'); // Assuming firebase.js exports db

// GET all messages for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const messagesSnapshot = await db.collection('users').doc(userId).collection('messages').orderBy('timestamp', 'desc').get();
    const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET a single message by ID
router.get('/:userId/:messageId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const messageId = req.params.messageId;
    const messageDoc = await db.collection('users').doc(userId).collection('messages').doc(messageId).get();
    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({ id: messageDoc.id, ...messageDoc.data() });
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// POST a new message
router.post('/:recipientId', async (req, res) => {
  try {
    const recipientId = req.params.recipientId;
    const { senderId, subject, body } = req.body;

    if (!senderId || !recipientId || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields (senderId, recipientId from URL, subject, body)' });
    }

    const commonMessageData = {
      senderId,
      recipientId,
      subject,
      body,
      timestamp: new Date(),
    };

    // Add to recipient's inbox (unread)
    const recipientMessage = { ...commonMessageData, read: false };
    const docRefRecipient = await db.collection('users').doc(recipientId).collection('messages').add(recipientMessage);
    console.log(`Message from ${senderId} to ${recipientId} stored in recipient's inbox.`);

    // Also add to sender's inbox/message list (as read by sender)
    if (senderId !== recipientId) { // Avoid double-adding if sending to oneself
      const senderMessage = { ...commonMessageData, read: true }; // Sender has "read" their own message
      await db.collection('users').doc(senderId).collection('messages').add(senderMessage);
      console.log(`Message from ${senderId} to ${recipientId} also stored in sender's list.`);
    }

    // The message object returned to the frontend should be the one relevant to the sender (for optimistic update)
    // or clearly indicate what was created. Let's return the recipient's version with its ID.
    res.status(201).json({ id: docRefRecipient.id, ...recipientMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// PUT to mark a message as read/unread
router.put('/:userId/:messageId/read', async (req, res) => {
  try {
    const userId = req.params.userId;
    const messageId = req.params.messageId;
    const { read } = req.body; // Expecting { "read": true } or { "read": false }

    if (typeof read !== 'boolean') {
      return res.status(400).json({ error: 'Invalid "read" status provided.' });
    }

    const messageRef = db.collection('users').doc(userId).collection('messages').doc(messageId);
    await messageRef.update({ read: read });
    res.status(200).json({ message: `Message ${messageId} marked as ${read ? 'read' : 'unread'}.` });
  } catch (error) {
    console.error("Error updating message read status:", error);
    res.status(500).json({ error: 'Failed to update message read status' });
  }
});

// DELETE a message
router.delete('/:userId/:messageId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const messageId = req.params.messageId;
    await db.collection('users').doc(userId).collection('messages').doc(messageId).delete();
    res.status(200).json({ message: `Message ${messageId} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router; 