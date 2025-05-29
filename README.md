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

### Frontend
* First place your two spotify certificates in the frontend root folder:
    * test-spotify-site.local-key.pem
    * test-spotify-site.local.pem
* Then proceed to run the following commands to setup the frontend through your terminal
    * `cd frontend`
    * `npm install`
    * `npm run dev`

### Backend
* Place the following files in your backend root directory:
    * test-spotify-site.local-key.pem
    * test-spotify-site.local.pem
    * permissions.json
* Run the following commands to setup backend through the terminal
    * `cd backend`
    * `npm install`
    * `npm start`

# How to Use Project
1. Sign in with Spotify
* Click the “Log in with Spotify” button on the homepage.
* Authorize the app to access your Spotify data (this allows the app to show your liked songs, top artists, etc.).
2. Explore Your Stats
* View your Liked Songs, Top Songs, and Top Artists by navigating the sidebar.
* See details like album covers, track info, and the date you added each song.
3. Edit Your Profile
* Go to the Profile page to update your display name, bio, or make your profile public/private.
* Choose which stats you want to share with others.
4. Discover Other Users
* Visit the Discover page to browse public profiles.
* View other users’ music tastes and send them messages.
5. Join the Conversation
* Check out the Forums page to see current music discussions.
* Create new threads, post your thoughts, or like others’ posts.
6. Send and Receive Messages
* Use the Inbox to read and send private messages with other users.

