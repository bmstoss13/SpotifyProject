import React, { useEffect, useState } from "react";
import SquareContainer from "../components/SquareContainer";
import "./Top.css";
import TimeFilter from "../components/TimeFilter";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const TopArtists = () => {
  const { getValidAccessToken } = useAuth();
  const [time, changeTime] = useState("long_term");
  const [artists, setArtists] = useState([]);
  const [id, setId] = useState("");
  const fetchSpotifyUserId = async () => {
    const accessToken = await getValidAccessToken();
    const response = await axios.get(
      `https://test-spotify-site.local:3000/top/user-id?access_token=${accessToken}`
    );
    const userId = response.data.userId;
    setId(userId);
    return userId;
  };
  const updateUser = async (topArtists) => {
    try {
      const response = await axios.post(
        `https://test-spotify-site.local:3000/top/update-artists/?id=${id}`,
        { topArtists }
      );
      console.log("Database updated:", response.data);
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

  const breakResponse = (response) => {
    const temp = response.map((artist) => ({
      artist: artist.name,
      pfp: artist.images[2]?.url || artist.images[0]?.url || "", // fallback logic
      page: artist.external_urls.spotify,
    }));
    setArtists(temp);
    console.log(temp);
  };

  const fetchArtists = async () => {
    try {
      const accessToken = await getValidAccessToken();
      console.log("Access Token:", accessToken);
      if (!accessToken) return console.log("❌ No access token");
      const response = await axios.get(
        `https://test-spotify-site.local:3000/top/top-artists?access_token=${accessToken}&time_range=${time}`
      );
      breakResponse(response.data.items);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchSpotifyUserId(); // sets id
      await fetchArtists(); // sets artists
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (id && artists.length > 0) {
      updateUser(artists);
    }
  }, [id, artists]);

  useEffect(() => {
    console.log(time);
    fetchArtists();
    updateUser(artists);
  }, [time]);
  useEffect(() => {
    console.log("ID CHANGES", id);
  }, [id]); // track changes to id

  return (
    <div className="left-aligned-container">
      <h1 className="top-header">Top Artists</h1>
      <TimeFilter changeTime={changeTime} />
      <SquareContainer type={"artists"} top={artists} />
    </div>
  );
};

export default TopArtists;
