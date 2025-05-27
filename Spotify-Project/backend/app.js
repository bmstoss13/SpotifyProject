const express=require('express');
const cors = require('cors');
require('dotenv').config();
const https = require("https");


const app=express();

const port=3000;

app.use(cors())
app.use(express.json());

const profileRoute = require("./routes/profile")
const likedSongsRoute = require('./routes/likedSongs');


app.use("/profile", profileRoute);
app.use('/api/liked-songs', likedSongsRoute);


app.get('/', (req, res) => {
    res.send("Spotify Project homepage");
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

const options = {
  key: fs.readFileSync("test-spotify-site.local-key.pem"),
  cert: fs.readFileSync("test-spotify-site.local.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(
    `HTTPS Server is running on https://test-spotify-site.local:${port}`
  );
});
