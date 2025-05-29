const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require('../firebase');
// GET /top-artists?access_token=...
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
    //console.log('🎵 Top Artists:', response.data);
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

router.post("update-artists/", async (req, res) => {
  const id = req.query.id;
  const { topArtists } = req.body;
  try {
    const docRef = db.collection("top").doc(id);
    await docRef.update({ topArtists }); 
    res.status(200).send("Document updated successfully");
  } catch (err) {
    console.error("Error updating document: ", err);
    res.status(500).send("Error updating document");
  }

});

router.post("update-songs/", async (req, res) => {
  const id = req.query.id;
  const { topSongs } = req.body;
  try {
    const docRef = db.collection("top").doc(id);
    await docRef.update({ topSongs }); 
    res.status(200).send("Document updated successfully");
  } catch (err) {
    console.error("Error updating document: ", err);
    res.status(500).send("Error updating document");
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
