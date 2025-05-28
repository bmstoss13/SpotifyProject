const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

// get user's profile
export const getSpotifyProfile = async (accessToken) => {
	try {
		const response = await fetch(`{$SPOTIFY_BASE_URL}/me`, {
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

// get user's top songs

export const getTopTracks = async (accessToken, timeRange = 'medium_term', limit = 20) => {
	try {
		const response = await fetch(
			`${SPOTIFY_BASE_URL}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
			{
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		return await response.json();
	} catch (error) {
		console.error('Error fetching top songs:', error);
		throw error;
	}
}

export const getTopArtists = async (accessToken, timeRange = 'medium_term', limit = 20) => {
  try {
    const response = await fetch(
      `${SPOTIFY_BASE_URL}/me/top/artists?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
};

export const getLikedSongs = async (accessToken, limit = 50, offset = 0) => {
  try {
    const response = await fetch(
      `${SPOTIFY_BASE_URL}/me/tracks?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    throw error;
  }
};