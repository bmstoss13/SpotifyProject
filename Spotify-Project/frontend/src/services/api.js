import axios from 'axios'

const port = 3000;

const request = axios.create({ baseURL: `https://test-spotify-site.local:${port}` })

// export const getProfile = () => request.get('/profile')
export const getProfile = () => {
  return axios.get('https://test-spotify-site.local:3000/profile');
};

export const getDiscover = () => request.get('/discover')