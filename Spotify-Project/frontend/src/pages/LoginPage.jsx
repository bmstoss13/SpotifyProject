import React, { useEffect } from 'react';
import { initiateSpotifyLogin } from '../services/api';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'

function LoginPage() {
	const { accessToken } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (accessToken) {
			navigate('/profile'); // redirect if already logged in
		}
	}, [accessToken, navigate]);

	const handleLogin = () => {
		initiateSpotifyLogin();
	};

	return (
		<div className='login-page full-screen'>
			<div className='login-container'>
				<h1 className='welcome-text'>Welcome to Heartify</h1>
				<button onClick={handleLogin}>Login with Spotify</button>
			</div>
		</div>
	);
}

export default LoginPage;
