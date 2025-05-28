const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const axios = require('axios');

require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

//scopes for what needs to be accessed in the application
const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-library-read',
];

function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

router.get('/login', (req, res) => {
    const state = generateRandomString(16);
    req.session.spotifyAuthState = state;
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scopes.join(' '),
            redirect_uri: REDIRECT_URI,
            state: state
        })
    );
});



//Server to Server request


router.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.session.spotifyAuthState;

    if (state === null || state !== storedState) {
        return res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } 
    else {
        delete req.session.spotifyAuthState;
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
                }
            }
        );

        const { access_token, refresh_token, expires_in } = response.data;

        console.log('Spotify tokens received:');
        console.log('Received access_token:', access_token);
        console.log('Received refresh_token:', refresh_token);
        console.log('Expires In (seconds):', expires_in);

        return res.redirect(`${FRONTEND_URI}/profile#` + querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            expires_in: expires_in
        }));
    }
    catch (e) {
        console.error('Error during Spotify token exchange:', e.response ? e.response.data : e.message);
        return res.redirect('/#' + querystring.stringify({
            error: 'invalid_token'
        }));
    }
});

router.get('/refresh_token', async (req, res) => {
    const refresh_token = req.query.refresh_token;
    if (!refresh_token) {
        return res.status(400).json({ error: 'Missing refresh token' });
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
                }
            }
        );

        const { access_token, expires_in } = response.data;

        console.log('Refreshed access_token:', access_token);
        console.log('New expires_in:', expires_in);

        res.json({
            access_token,
            expires_in
        });
    } 
    catch(e){
        console.error('Error refreshing token:', e.response ? e.response.data : e.message);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
});


module.exports = router;