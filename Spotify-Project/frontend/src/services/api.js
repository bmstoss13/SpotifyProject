import axios from 'axios'

const port = 3000;
const API_URL = `https://test-spotify-site.local:${port}`;

const request = axios.create({ baseURL: API_URL });

export const getProfile = () => request.get('/profile')

export const getDiscover = () => request.get('/discover')

export const initiateSpotifyLogin = () => {
	window.location.href = `${API_URL}/auth/login`;
}


export const getInboxThreads = (userId) => {
	// TODO: Add token for authentication if needed
	return request.get(`/inbox/${userId}`);
};


export const sendMessage = (recipientUserId, messageData) => {
	return request.post(`/inbox/${recipientUserId}`, messageData);
};

// --- User API Calls ---
export const searchUsers = (query) => {
	return request.get(`/users/search?q=${encodeURIComponent(query)}`);
};

export const getUserProfile = (userId) => {
	return request.get(`/users/${userId}`);
};

// --- Forum API Calls ---
export const getForums = () => {
	return request.get('/forums');
};

export const getForum = (forumId) => {
	return request.get(`/forums/${forumId}`);
};

export const createForum = (forumData) => {
	return request.post('/forums', forumData);
};

export const replyToForum = (forumId, replyData) => {
	return request.post(`/forums/${forumId}/replies`, replyData);
};

export const likeForum = (forumId, userId) => {
	return request.post(`/forums/${forumId}/like`, { userId });
};

export const likeReply = (forumId, replyId, userId) => {
	return request.post(`/forums/${forumId}/replies/${replyId}/like`, { userId });
};
