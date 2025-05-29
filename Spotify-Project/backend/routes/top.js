const express = require("express");
const router = express.Router();
const axios = require("axios");
const { db, admin } = require('../firebase');



router.get("/user-id", async (req, res) => {
  const accessToken = req.query.access_token;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    // Create axios instance with authorization header
    const spotify = axios.create({
      baseURL: "https://api.spotify.com/v1",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Request user's profile from Spotify
    const response = await spotify.get("/me");
    console.log("🎵 User Profile:", response.data);
    const userId = response.data.id;

    console.log("🎵 Spotify User ID:", userId);
    res.status(200).json({ userId });
  } catch (error) {
    console.error("❌ Error fetching Spotify user ID:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch user ID" });
  }
});
router.get("/top-artists", async (req, res) => {
  const accessToken = req.query.access_token;
  const time = req.query.time_range; // not req.params

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/artists?time_range=${time}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Error fetching top artists:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});
router.get("/coverimage", async (req, res) => {
    const accessToken = req.query.access_token;
    const id = req.query.id; // ✅ extract id from query string
  
    if (!accessToken || !id) {
      return res.status(400).json({ error: "Access token and track ID are required" });
    }
  
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("🎵 Track Info:", response.data);
      res.json(response.data);
    } catch (error) {
      console.error("❌ Error Fetching Track Cover:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch track info" });
    }
  });

  router.post("/update-artists", async (req, res) => {
    const userId = req.query.id; // ?id=user123
    const { topArtists } = req.body;
    console.log("userID in update artists:", userId);
    if (!userId || !topArtists) {
      return res.status(400).json({ error: "Missing userId or topArtists in request." });
    }
    try {
      const docRef = db.collection("users").doc(userId);
      await docRef.update({
        topArtists,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
      res.status(200).json({ message: "topArtists updated successfully." });
    } catch (err) {
      console.error("Error updating topArtists:", err);
      res.status(500).json({ error: "Failed to update topArtists." });
    }
  });

  router.post("/update-tracks", async (req, res) => {
    const userId = req.query.id; // ?id=user123
    const { topTracks } = req.body;
    console.log("userID in update tracks:", userId);
  
    if (!userId || !topTracks) {
      return res.status(400).json({ error: "Missing userId or topTracks in request." });
    }
  
    try {
      const docRef = db.collection("users").doc(userId);
      await docRef.update({
        topTracks,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });
      res.status(200).json({ message: "topTracks updated successfully." });
    } catch (err) {
      console.error("Error updating topTracks:", err);
      res.status(500).json({ error: "Failed to update topTracks." });
    }
  });
  

router.get("/top-songs", async (req, res) => {
  const accessToken = req.query.access_token; // not req.params
  const time = req.query.time_range; 
  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${time}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    //console.log('🎵 Top Tracks:', response.data);
    console.log("🎵 Top Tracks:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Error fetching top trackss:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});


module.exports = router;
