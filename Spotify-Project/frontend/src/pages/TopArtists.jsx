import {React, use, useEffect, useState} from "react";
import Artist from "../components/Artist";
import SquareContainer from "../components/SquareContainer";
import "./Top.css";
import TimeFilter from "../components/TimeFilter";
import axios from "axios";
const TopArtists = () => {
  const [time, changeTime] = useState("All-Time");
  const [artists, setArtists] = useState([]);
  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/top/artists", {
      params: { time },
      });
      setArtists(response.data);
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  }
  useEffect(() => { 
    fetchArtists();
  }, []);
  useEffect(() => {
    fetchArtists();
  }, [time]);
  const art = [
    { artist: "Drake", pfp: "https://example.com/drake.jpg" },
    { artist: "Taylor Swift", pfp: "https://example.com/taylor.jpg" },
    { artist: "The Weeknd", pfp: "https://example.com/weeknd.jpg" },
    { artist: "Ed Sheeran", pfp: "https://example.com/ed.jpg" },
    { artist: "Billie Eilish", pfp: "https://example.com/billie.jpg" },
  ];
  return (
    <>
      <div className="left-aligned-container">
        <div>
          <h1 className="top-header">Top Artists</h1>
        </div>
        <div>
        </div>
        <TimeFilter changeTime={changeTime}/>
        <div>
          <SquareContainer type={"artists"} top={art} />
        </div>
      </div>
    </>
  );
};

export default TopArtists;
