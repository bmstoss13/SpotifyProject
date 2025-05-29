const admin = require("firebase-admin");
const serviceAccount = require("./permissions.json");

// Initialize Firebase Admin SDK if it hasn't been already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const populateMessagesForTestUser1 = async () => {
  const userId = "testUser1";
  const messagesCollectionRef = db.collection('users').doc(userId).collection('messages');

  console.log(`Attempting to populate messages for user: ${userId}`);

  const messages = [
    {
      senderId: "testUser2", // Message from testUser2 to testUser1
      recipientId: userId,
      subject: "Hello from User 2!",
      body: "Just wanted to say hi and see how you're doing. Heard you're working on a cool Spotify project!",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      read: false,
    },
    {
      senderId: userId, // Message from testUser1 to testUser2
      recipientId: "testUser2",
      subject: "Re: Hello from User 2!",
      body: "Hey User 2! Thanks for reaching out. The project is coming along well. How are things with you?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true, // testUser1 sent this, so it's implicitly read by them
    },
    {
      senderId: "testUser3", // Message from testUser3 to testUser1
      recipientId: userId,
      subject: "Quick Question",
      body: "Do you have a moment to chat later today about the new feature?",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      read: false,
    },
    {
      senderId: userId, // Another message from testUser1 to testUser2 (different conversation)
      recipientId: "testUser2",
      subject: "Weekend Plans?",
      body: "Any fun plans for the weekend? Thinking of checking out that new band.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: true, 
    },
    {
      senderId: "testUser2", // Reply from testUser2
      recipientId: userId,
      subject: "Re: Weekend Plans?",
      body: "Oh, that sounds great! I'm free on Saturday. Let me know the details!",
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      read: false, 
    }
  ];

  try {
    let count = 0;
    for (const msg of messages) {
      // If msg.recipientId is userId, it means userId is the recipient.
      // Store it in userId's message collection.
      if (msg.recipientId === userId) {
        await db.collection('users').doc(userId).collection('messages').add(msg);
        console.log(`  Added to ${userId}'s inbox: "${msg.subject}" (from ${msg.senderId})`);
        count++;
      }
      
      // If msg.senderId is userId, it means userId is the sender.
      // Store a copy in userId's own message collection (as a sent item essentially part of the thread).
      // And also store a copy in the actual recipient's message collection.
      if (msg.senderId === userId) {
        // Add to sender's (userId) own message list
        // The message object (msg) already has read: true for sender if set in sample data
        await db.collection('users').doc(userId).collection('messages').add(msg); 
        console.log(`  Added to ${userId}'s own list (as sender): "${msg.subject}" (to ${msg.recipientId})`);
        count++; // Count this as a primary message for testUser1 if they sent it

        // Add to actual recipient's message list for conversation symmetry
        if (msg.recipientId !== userId) { // Ensure not sending to oneself and duplicating
          const recipientCopy = { ...msg, read: false }; // Recipient hasn't read it yet
          await db.collection('users').doc(msg.recipientId).collection('messages').add(recipientCopy);
          console.log(`    Added to ${msg.recipientId}'s inbox: "${msg.subject}" (from ${userId}) for symmetry.`);
        }
      }
    }
    // Adjust success message as count might double-count if a message is to oneself, though not in sample data.
    // The goal is that testUser1's message list should contain all messages for their conversations.
    console.log(`Successfully processed ${messages.length} sample messages. Check Firestore for details for user ${userId}. Total documents added related to ${userId}'s conversations might be higher due to symmetric storage.`);
  } catch (error) {
    console.error("Error populating messages:", error);
  }
};

populateMessagesForTestUser1(); 