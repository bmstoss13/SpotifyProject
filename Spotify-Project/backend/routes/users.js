const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// GET users (with optional search query)
// GET /users/search?q=searchText
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.q ? String(req.query.q).toLowerCase() : null;
    let usersQuery = db.collection('users');

    // Firestore does not support direct lowercase comparison or true substring matches in queries easily.
    // For a simple startsWith search (case-sensitive):
    // if (searchQuery) {
    //   usersQuery = usersQuery.orderBy('profileName').startAt(searchQuery).endAt(searchQuery + '\uf8ff');
    // }
    // For a more flexible search, you often fetch and filter, or use a dedicated search service.
    // Let's fetch all users for now and filter (NOT scalable for many users).
    // TODO: Implement a more scalable search solution for production (e.g., Algolia, Elasticsearch, or different data modeling).

    const usersSnapshot = await usersQuery.get();
    let users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (searchQuery) {
      users = users.filter(user => 
        (user.profileName && user.profileName.toLowerCase().includes(searchQuery))
      );
    }
    
    // Exclude password hashes or sensitive info if present
    users = users.map(({ password, ...rest }) => rest); 

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching/searching users:", error);
    res.status(500).json({ error: 'Failed to fetch/search users' });
  }
});

// GET a single user by ID (useful for fetching names for threads)
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userData } = userDoc.data(); // Exclude password
    res.status(200).json({ id: userDoc.id, ...userData });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router; 