import React, { useEffect } from 'react';
import { initiateSpotifyLogin } from '../services/api';
import { useAuth } from '../components/AuthContext';


function LoginPage() {
    const handleLogin = () => {
        initiateSpotifyLogin(); 
    };

    // const { setAccessToken, setRefreshToken, setExpiresIn } = useAuth();

    



    return (
        <div>
            <h1>Welcome to spoti.love</h1>
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
}

export default LoginPage;