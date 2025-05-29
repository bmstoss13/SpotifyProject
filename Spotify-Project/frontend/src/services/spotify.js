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
		console.log('🎵 Spotify Profile:', response.data);
		return response.data;
	}
	catch (error) {
		console.error('Error getting spotify profile:', error);
		throw error;
	}
}

// get liked songs
export async function fetchLikedSongs(token, limit = 20, offset = 0) {
	const response = await fetch(
	  `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
	  {
		headers: {
		  Authorization: `Bearer ${token}`,
		},
	  }
	);
	if (!response.ok) throw new Error('Failed to fetch liked songs');
	return response.json();
  }