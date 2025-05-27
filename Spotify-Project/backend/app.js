const express=require('express');
const cors = require('cors');
require('dotenv').config();

const app=express();

const port=3000;

app.use(cors())
app.use(express.json());

const profileRoute = require("./routes/profile")

app.use("/profile", profileRoute);

app.get('/', (req, res) => {
    res.send("Spotify Project homepage");
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
