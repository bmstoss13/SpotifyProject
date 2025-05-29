import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection,
  query,
  where,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';

// create user id based on spotify id
const getUserId = (spotifyProfile) => {
  return spotifyProfile?.id || 'anonymous';
};

// get user profile from firestore
export const getUserProfile = async (spotifyProfile) => {
  try {
    const userId = getUserId(spotifyProfile);
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      // Create default profile if doesn't exist
      const defaultProfile = {
        profileName: spotifyProfile?.display_name || '',
        bio: '',
        image: spotifyProfile?.images?.[0]?.url || '',
        isProfilePublic: true,
        showTopArtists: true,
        displayTopSongs: true,
        spotifyId: spotifyProfile?.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userDocRef, defaultProfile);
      return { id: userId, ...defaultProfile };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export async function getOtherUserProfile(userId) {
  try {
    const userDocRef = doc(db, "users", userId);
    console.log("user ID: " + userId)
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log("user doc snapshot: " + userDocSnap.id)
      return { id: userDocSnap.id, ...userDocSnap.data() };
    } else {
      throw new Error("User profile does not exist.");
    }
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
}



// Update user profile in Firestore
export const updateUserProfile = async (spotifyProfile, profileData) => {
  try {
    const userId = getUserId(spotifyProfile);
    const userDocRef = doc(db, 'users', userId);
    
    const updateData = {
      ...profileData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(userDocRef, updateData);
    return { id: userId, ...updateData };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// get all public profiles for discover page
export const getPublicProfiles = async (limit = 20) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('isProfilePublic', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const profiles = [];
    
    querySnapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    
    return profiles.slice(0, limit);
  } catch (error) {
    console.error('Error getting public profiles:', error);
    throw error;
  }
};

// save user's Spotify data (top artists, tracks, etc.)
export const saveSpotifyData = async (spotifyProfile, data) => {
  try {
    const userId = getUserId(spotifyProfile);
    const spotifyDataRef = doc(db, 'spotify-data', userId);
    
    const spotifyData = {
      ...data,
      userId: userId,
      lastUpdated: serverTimestamp()
    };
    
    await setDoc(spotifyDataRef, spotifyData, { merge: true });
    return spotifyData;
  } catch (error) {
    console.error('Error saving Spotify data:', error);
    throw error;
  }
};

// get user's saved Spotify data
export const getSpotifyData = async (spotifyProfile) => {
  try {
    const userId = getUserId(spotifyProfile);
    const spotifyDataRef = doc(db, 'spotify-data', userId);
    const spotifyDoc = await getDoc(spotifyDataRef);
    
    if (spotifyDoc.exists()) {
      return spotifyDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting Spotify data:', error);
    throw error;
  }
};