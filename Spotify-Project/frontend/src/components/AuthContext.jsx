import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));
  const [expiresIn, setExpiresIn] = useState(localStorage.getItem("expires_in"));

  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const auth = hashParams.get("access_token");
    const refresh = hashParams.get("refresh_token");
    const expires = hashParams.get("expires_in");

    if (auth) {
      localStorage.setItem("access_token", auth);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("expires_in", expires);
      localStorage.setItem("token_timestamp", Date.now().toString());

      setAccessToken(auth);
      setRefreshToken(refresh);
      setExpiresIn(expires);

      window.history.replaceState(null, '', window.location.pathname);

      // Redirect
      navigate("/profile");
    }
  }, [navigate]);

  // Utility to check token expiration
  const isTokenExpired = () => {
    const expiresIn = localStorage.getItem("expires_in");
    const tokenTime = localStorage.getItem("token_timestamp");

    if (!expiresIn || !tokenTime) return true;

    const now = Date.now();
    const elapsed = (now - parseInt(tokenTime, 10)) / 1000; // in seconds
    return elapsed >= parseInt(expiresIn, 10);
  };

  // Get a fresh access token if needed
  const getValidAccessToken = async () => {
    if (!isTokenExpired()) return localStorage.getItem("access_token");

    try {
      const res = await axios.get(`https://test-spotify-site.local:3000/auth/refresh?refresh_token=${refreshToken}`);
      const { access_token, expires_in } = res.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
      localStorage.setItem("token_timestamp", Date.now().toString());

      setAccessToken(access_token);
      setExpiresIn(expires_in);

      return access_token;
    } catch (err) {
      console.error("Failed to refresh access token:", err);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, expiresIn, getValidAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('expires_in');
}

export function useAuth() {
  return useContext(AuthContext);
}
