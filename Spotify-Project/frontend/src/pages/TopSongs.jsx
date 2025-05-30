import React, { useEffect, useState } from "react";
import SquareContainer from "../components/SquareContainer";
import "./Top.css";
import TimeFilter from "../components/TimeFilter";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

const TopSongs = () => {
  const { getValidAccessToken } = useAuth();
  const [time, changeTime] = useState("long_term");
  const [songs, setSongs] = useState([]);
  const [id, setId] = useState("");

  const fetchSpotifyUserId = async () => {
    try {
      const accessToken = await getValidAccessToken();
      const response = await axios.get(
        `https://test-spotify-site.local:3000/top/user-id?access_token=${accessToken}`
      );
      const userId = response.data.userId;
      setId(userId);
      return userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const updateUser = async (userId, topTracks) => {
    try {
      const response = await axios.post(
        `https://test-spotify-site.local:3000/top/update-tracks/?id=${userId}`,
        { topTracks }
      );
      console.log("✅ Database updated:", response.data);
    } catch (error) {
      console.error("❌ Error updating database:", error);
    }
  };

  const breakResponse = (response) => {
    const temp = response.map((track) => {
      const artists = track.artists.map((a) => a.name).join(", ");
      return {
        track: track.name,
        artists,
        page: track.external_urls.spotify,
        pfp: track.album?.images[1]?.url || track.album?.images[0]?.url || "",
      };
    });
    setSongs(temp);
    return temp;
  };

  const fetchSongs = async () => {
    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        console.log("❌ No access token");
        return [];
      }

      const response = await axios.get(
        `https://test-spotify-site.local:3000/top/top-songs?access_token=${accessToken}&time_range=${time}`
      );
      return breakResponse(response.data.items);
    } catch (error) {
      console.error("❌ Error fetching songs:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const userId = await fetchSpotifyUserId();
      const processedSongs = await fetchSongs();
      if (userId && processedSongs.length > 0) {
        await updateUser(userId, processedSongs);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchByTime = async () => {
      const processedSongs = await fetchSongs();
      if (id && processedSongs.length > 0) {
        await updateUser(id, processedSongs);
      }
    };
    fetchByTime();
  }, [time]);

  return (
    <div className="left-aligned-container">
      <h1 className="top-header">Top Songs</h1>
      {songs.length === 0 && <h2>Loading Your Top Songs...</h2>}
      {songs.length !== 0 && (
        <>
          <TimeFilter changeTime={changeTime} />
          <SquareContainer type={"songs"} top={songs} />
        </>
      )}
    </div>
  );
};

export default TopSongs;
