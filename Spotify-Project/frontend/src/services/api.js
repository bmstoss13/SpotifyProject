import axios from 'axios'

const request = axios.create({ baseURL: 'http://localhost:3000/profile/' })

export const getProfile = () => request.get('/')