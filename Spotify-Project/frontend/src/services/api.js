import axios from 'axios'

const port = 3000;

const request = axios.create({ baseURL: `https://test-spotify-site.local:${port}` })

export const getProfile = () => request.get('/profile')

export const getDiscover = () => request.get('/discover')

export const initiateSpotifyLogin = () => {
	window.location.href = `https://test-spotify-site.local:${port}/auth/login`;
}

export const viewOtherProfs = (userId) => request.get(`/user/${userId}`);