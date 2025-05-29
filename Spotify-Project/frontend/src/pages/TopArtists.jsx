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
  const updateDatabase = async (topArtists) => {
    try {
      const response = await axios.post(
        `https://test-spotify-site.local:3000/top/update-artists/?id=${id}`,
        {topArtists}
      );
      console.log("Database updated:", response.data);
    } catch (error) {
      console.error("Error updating database:", error);
    }
  }

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
    fetchArtists(); // runs once on mount
    //updateDatabase(artists); // update database with initial artist
  }, []);
  
  useEffect(() => {
    //console.log("Updated artists:", artists); // track artists state updates (optional)
  }, [artists]);

  useEffect(() => {
    console.log(time);
    fetchArtists();
  }, [time]);

  return (
    <div className="left-aligned-container">
      <h1 className="top-header">Top Artists</h1>
      <TimeFilter changeTime={changeTime} />
      <SquareContainer type={"artists"} top={artists} />
    </div>
  );
};

export default TopArtists;
