import axios from "axios";
const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

// axios for spotify API calls
const createSpotifyRequest = (accessToken) => {
	return axios.create({
		baseURL: SPOTIFY_BASE_URL,
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		}
	});
}

// get user's profile
export const getSpotifyProfile = async (accessToken) => {
	try {
		const spotify = createSpotifyRequest(accessToken)
		const response = await spotify.get('/me');
		return response.data;
	}
	catch (error) {
		console.error('Error getting spotify profile:', error);
		throw error;
	}
}
