import axios from 'axios'
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const port = 3000;

const request = axios.create({ baseURL: `https://test-spotify-site.local:${port}` })

export const getProfile = () => request.get('/profile')
// export const getProfile = async (userId) => {
// 	const docRef = doc(db, "users", userId);
// 	const docSnap = await getDoc(docRef);

// 	if (docSnap.exists()) {
// 		return { data: docSnap.data() };
// 	} else {
// 		throw new Error("No such profile!");
// 	}
// };

export const getDiscover = () => request.get('/discover')

export const initiateSpotifyLogin = () => {
	window.location.href = `https://test-spotify-site.local:${port}/auth/login`;
}
