// import { React, useState, useEffect } from "react";
// import SquareContainer from "../components/SquareContainer";
// import "./Top.css";
// import TimeFilter from "../components/TimeFilter";
// import { useAuth } from "../components/AuthContext";
// import axios from "axios";
// const TopSongs = () => {
//   const { getValidAccessToken } = useAuth();
//   const [time, changeTime] = useState("long_term");
//   const [songs, setSongs] = useState([]);
//   const [id, setId] = useState("");
//   const fetchSpotifyUserId = async () => {
//     const accessToken = await getValidAccessToken();
//     const response = await axios.get(
//       `https://test-spotify-site.local:3000/top/user-id?access_token=${accessToken}`
//     );
//     const userId = response.data.userId;
//     setId(userId);
//     return userId;
//   };
//   const updateUser = async (topTracks) => {
//     try {
//       const response = await axios.post(
//         `https://test-spotify-site.local:3000/top/update-tracks/?id=${id}`,
//         { topTracks }
//       );
//       console.log("Database updated:", response.data);
//     } catch (error) {
//       console.error("Error updating database:", error);
//     }
//   };
//   const fetchCoverImage = async (id) => {
//     try {
//       const accessToken = await getValidAccessToken();
//       console.log("Access Token:", accessToken);
//       if (!accessToken) return console.log("❌ No access token");
//       const response = await axios.get(
//         `https://test-spotify-site.local:3000/top/coverimage?access_token=${accessToken}&id=${id}`
//       );
//       console.log(response.data.album.images[1].url);
//       return response.data.album.images[1].url;
//     } catch (error) {
//       console.error("Error fetching cover_image:", error);
//     }
//   };

//   const breakResponse = async (response) => {
//     const temp = [];
//     for (let i = 0; i < response.length; i++) {
//       const coverimage = await fetchCoverImage(response[i].id);
//       const artists = [];
//       for (let n = 0; n < response[i].artists.length; n++) {
//         const artist = response[i].artists[n].name;
//         artists.push(artist);
//       }
//       temp.push({
//         track: response[i].name,
//         artists: artists.join(", "),
//         page: response[i].external_urls.spotify,
//         pfp: coverimage,
//       });
//     }
//     setSongs(temp);
//     console.log(temp);
//   };

//   const fetchSongs = async () => {
//     try {
//       const accessToken = await getValidAccessToken();
//       console.log("Access Token:", accessToken);
//       if (!accessToken) return console.log("❌ No access token");
//       const response = await axios.get(
//         `https://test-spotify-site.local:3000/top/top-songs?access_token=${accessToken}&time_range=${time}`
//       );
//       console.log(response.data.items);
//       breakResponse(response.data.items);
//     } catch (error) {
//       console.error("Error fetching songs:", error);
//     }
//   };


//   useEffect(() => {
//     const fetchAll = async () => {
//       await fetchSpotifyUserId(); // sets id
//       await fetchSongs(); // sets artists
//     };
//     fetchAll();
//   }, []);

//   useEffect(() => {
//     if (id && songs.length > 0) {
//       updateUser(songs);
//     }
//   }, [id, songs]);
//   useEffect(() => {
//     console.log(time);
//     fetchSongs();
//     updateUser(songs);
//   }, [time]);
//   useEffect(() => {
//     console.log("ID CHANGES", id);
//   }, [id]); // track changes to id


//   return (
//     <>
//       <div className="left-aligned-container">
//         <div>
//           <h1 className="top-header">Top Songs</h1>
//         </div>
//         <div>
//           <TimeFilter changeTime={changeTime} />
//         </div>
//         <div>
//           <SquareContainer type={"songs"} top={songs} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default TopSongs;


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
      <TimeFilter changeTime={changeTime} />
      <SquareContainer type="songs" top={songs} />
    </div>
  );
};

export default TopSongs;
