# SpotifyProject

## Details
Using React, Express, and Firebase, create a web application using the Spotify API. The purpose of the app is to keep users engaged with Spotify by allowing them to view their top artists and songs, create a profile that other users can view, post in message boards, and message other users. Spotify wants to be the place where people go to listen to AND talk about music. Your app will accomplish this with a React frontend, Express backend, and Firebase database. This means that all API or database interactions initiated by the user should send a request from the frontend (React) to the backend (Express), where the interaction with the Spotify API or Firebase occurs.

## Features
* Liked Songs Page
* User’s Top Artists Page
* User’s Top Songs Page
* User profile page
    * User can view and edit their profile
    * Can choose to display artists and songs from their Top/Liked pages
    * Can make their profile private, which hides it from the public page
* Discover page: displays all public users, so users can click and view others profiles and send messages
* Inbox page that shows your chats with other users
* Forum page that displays all of the discussion boards, which users can click on to access the posts

## Installation

### Frontend Setup

1. **Place the Spotify certificates** in the root of the `frontend` directory:
   - `test-spotify-site.local-key.pem`
   - `test-spotify-site.local.pem`

2. **Install dependencies and start the development server** by running the following commands in your terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```
### Backend Setup
1. **Refer to this [demo](https://github.com/swe-instructors-forge25/spotify-demo)** to receive your certificates, as well as set up your frontend url and backend callback url.
3. 
   ```bash
   cd backend
   npm install
   npm start
   ```
4. Fill in your `.env` information in the backend folder with the following information.
   ```
   FIREBASE_API_KEY=,
   FIREBASE_AUTH_DOMAIN=,
   FIREBASE_PROJECT_ID=,
   FIREBASE_STORAGE_BUCKET=,
   FIREBASE_MESSAGING_SENDER_ID=,
   FIREBASE_APP_ID=,
   FIREBASE_MEASUREMENT_ID=,
   SPOTIFY_CLIENT_ID=
   SPOTIFY_CLIENT_SECRET=
   SPOTIFY_REDIRECT_URI=
   FRONTEND_URI=
   ```

## How to Use Project
1. Sign in with Spotify
* Click the “Log in with Spotify” button on the homepage.
* Authorize the app to access your Spotify data (this allows the app to show your liked songs, top artists, etc.).

