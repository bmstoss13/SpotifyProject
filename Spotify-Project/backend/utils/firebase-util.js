// import { 
//   doc, 
//   getDoc, 
//   setDoc, 
//   updateDoc, 
//   collection,
//   query,
//   where,
//   getDocs,
//   serverTimestamp 
// } from 'firebase/firestore';
// import { db } from '../../firebase';

//const admin = require('firebase-admin');

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(), 
//     databaseURL: 'https://spotify-project-46d47.firebaseio.com',
//   });
// }

const admin = require("firebase-admin");
const db = require('../firebase');

// create user id based on spotify id
const getUserId = (spotifyProfile) => {
  return spotifyProfile?.id || 'anonymous';
};

// get user profile from firestore
const getUserProfile = async (spotifyProfile) => {
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

// Update user profile in Firestore
const updateUserProfile = async (spotifyProfile, profileData) => {
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
const getPublicProfiles = async (limit = 20) => {
  try {
    const usersRef = db.collection('users');
    const q = usersRef.where('isProfilePublic', '==', true).limit(limit);
    const snapshot = await q.get();

    const profiles = [];
    snapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });

    return profiles;
  } catch (error) {
    console.error('Error getting public profiles:', error);
    throw error;
  }
};

// save user's Spotify data (top artists, tracks, etc.)
const saveSpotifyData = async (spotifyProfile, data) => {
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
const getSpotifyData = async (spotifyProfile) => {
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

module.exports = { getPublicProfiles, getSpotifyData, getUserId, getUserProfile, saveSpotifyData, updateUserProfile };