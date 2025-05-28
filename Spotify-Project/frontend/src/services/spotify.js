const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

// get user's profile
export const getSpotifyProfile = async (accessToken) => {
	try {
		const response = await fetch(`${SPOTIFY_BASE_URL}/me`, {
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return await response.json();
	}
	catch (error) {
		console.error('Error getting spotify profile:', error);
		throw error;
	}
}