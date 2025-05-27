import axios from 'axios'

const port = 3000;

const request = axios.create({ baseURL: `https://test-spotify-site.local:${port}/profile/` })

export const getProfile = () => request.get('/')