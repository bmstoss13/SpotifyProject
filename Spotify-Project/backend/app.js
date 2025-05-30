const express=require('express');
const session = require('express-session')
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const db = require('./firebase');

const app=express();
const port = 3000;

app.use(cors())
app.use(express.json());

// Ensure we have a session secret
const sessionSecret = process.env.SPOTIFY_CLIENT_SECRET || 'fallback-secret-key-for-development';
console.log('Using session secret:', sessionSecret ? 'Secret is set' : 'No secret found');

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

const profileRoute = require("./routes/profile")
const likedSongsRoute = require('./routes/likedSongs');


app.use("/profile", profileRoute);
app.use('/api/liked-songs', likedSongsRoute);


// app.get('/', (req, res) => {
//     res.send("Spotify Project homepage");
// });

const discoverRoute = require("./routes/discover");
app.use('/discover', discoverRoute);

const topRoute = require('./routes/top');
app.use('/top', topRoute);


const authRoute = require("./routes/auth");
app.use('/auth', authRoute);


const userRoute = require("./routes/otherProfiles");
app.use('/user', userRoute)

const inboxRoute = require("./routes/inbox");
app.use('/inbox', inboxRoute);

const usersRoute = require("./routes/users");
app.use('/users', usersRoute);

const forumsRoute = require("./routes/forums");
app.use('/forums', forumsRoute);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

//https server setup

const options = {
  key: fs.readFileSync("test-spotify-site.local-key.pem"),
  cert: fs.readFileSync("test-spotify-site.local.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(
    `HTTPS Server is running on https://test-spotify-site.local:${port}`
  );
});
