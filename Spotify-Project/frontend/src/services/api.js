import axios from 'axios'

const request = axios.create({ baseURL: 'http://localhost:3000/profile/' })

export const getProfile = () => request.get('/')

export async function fetchLikedSongs(token) {
    const res = await axios.get('http://localhost:5000/api/liked-songs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  }
  