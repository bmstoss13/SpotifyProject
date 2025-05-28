const express = require("express");
const router = express.Router();
const axios = require("axios");

// GET /top-artists?access_token=...
router.get("/top-artists", async (req, res) => {
  const accessToken = req.query.access_token; // not req.params

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
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
  
router.get("/top-songs", async (req, res) => {
  const accessToken = req.query.access_token; // not req.params

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
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
