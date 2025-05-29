import { React, useState, useEffect} from "react";
import SquareContainer from "../components/SquareContainer";
import "./Top.css";
import TimeFilter from "../components/TimeFilter";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
const TopSongs = () => {
  const { getValidAccessToken } = useAuth();
  const [time, changeTime] = useState("long_term");
  const [songs, setSongs] = useState([]);
  const fetchCoverImage = async(id) =>{
    try {
      const accessToken = await getValidAccessToken();
      console.log("Access Token:", accessToken);
      if (!accessToken) return console.log("❌ No access token");
      const response = await axios.get(
        `https://test-spotify-site.local:3000/top/coverimage?access_token=${accessToken}&id=${id}`
      );
      console.log(response.data.album.images[1].url);
      return response.data.album.images[1].url;
    } catch (error) {
      console.error("Error fetching cover_image:", error);
    }
  }

  const breakResponse = async (response) => {
    const temp = [];
    for(let i = 0; i < response.length; i++) {
      const coverimage = await fetchCoverImage(response[i].id);
      const artists =[];
      for(let n = 0; n < response[i].artists.length; n++) {
        const artist = response[i].artists[n].name;
        artists.push(artist);
      }
      temp.push({
        track: response[i].name,
        artists: artists.join(", "),
        page: response[i].external_urls.spotify,
        pfp: coverimage
      });

    }
    setSongs(temp);
    console.log(temp);
  };
  
  const fetchSongs = async () => {
    try {
      const accessToken = await getValidAccessToken();
      console.log("Access Token:", accessToken);
      if (!accessToken) return console.log("❌ No access token");
      const response = await axios.get(
        `https://test-spotify-site.local:3000/top/top-songs?access_token=${accessToken}&time_range=${time}`
      );
      console.log(response.data.items);
      breakResponse(response.data.items);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };
  useEffect(() => {
    fetchSongs(); // runs once on mount
  }, []);
  useEffect(() => {
    console.log(time);
    fetchSongs();
  }
  , [time]);
  return (
    <>
      <div className="left-aligned-container">
        <div>
          <h1 className="top-header">Top Songs</h1>
        </div>
        <div>
          <TimeFilter changeTime={changeTime} />
        </div>
        <div>
          <SquareContainer type={"songs"} top={songs} />
        </div>
      </div>
    </>
  );
};

export default TopSongs;
