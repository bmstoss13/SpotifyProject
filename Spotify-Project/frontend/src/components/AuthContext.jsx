// components/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));
  const [expiresIn, setExpiresIn] = useState(localStorage.getItem("expires_in"));

  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const auth = hashParams.get("access_token");
    console.log("Auth Context: Access Token:", auth);
    const refresh = hashParams.get("refresh_token");
    console.log("Auth Context: Refresh Token:", refresh);
    const expires = hashParams.get("expires_in");

    if (auth) {
      localStorage.setItem("access_token", auth);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("expires_in", expires);


      setAccessToken(auth);
      setRefreshToken(refresh);
      setExpiresIn(expires);


      // ⚠️ Clean URL
      window.history.replaceState(null, '', window.location.pathname);

      // ✅ IMMEDIATE redirect
      navigate("/profile");
    }
  }, [navigate]);

    useEffect(() => {
        if (accessToken && refreshToken && expiresIn) {
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            localStorage.setItem("expires_in", expiresIn);
        }
    }, [accessToken, refreshToken, expiresIn]);


  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, expiresIn }}>
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
