import React from 'react';
import { initiateSpotifyLogin } from '../services/api';


function LoginPage() {
    const handleLogin = () => {
        initiateSpotifyLogin(); 
    };

    return (
        <div>
            <h1>Welcome to spoti.love</h1>
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
}

export default LoginPage;