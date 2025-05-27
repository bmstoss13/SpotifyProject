const express=require('express');
const session = require('express-session')
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app=express();

const port=3000;

app.use(cors())
app.use(express.json());

app.use(session({
  secret: process.env.SPOTIFY_CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
}));

const profileRoute = require("./routes/profile")

app.use("/profile", profileRoute);

app.get('/', (req, res) => {
    res.send("Spotify Project homepage");
});

const discoverRoute = require("./routes/discover");
app.get('/discover', discoverRoute);


const authRoute = require("./routes/auth");
app.use('/auth', authRoute);

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


