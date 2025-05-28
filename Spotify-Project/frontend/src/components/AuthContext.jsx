import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [expiresIn, setExpiresIn] = useState(null);

//     useEffect(() => {
//         const hashParams = new URLSearchParams(window.location.search); 

//         const auth = hashParams.get("access_token");
//         const refresh = hashParams.get("refresh_token");
//         const expires = hashParams.get("expires_in");

//         if (auth) {
//         setAccessToken(auth);
//         setRefreshToken(refresh);
//         setExpiresIn(expires);
      
//         window.location.replace("/profile");
//         }

//         // Clean up the paramerers from the URL
//         window.history.replaceState({}, document.title, window.location.pathname);
//     }, []);

    return (
      <AuthContext.Provider value={{ accessToken, setAccessToken, setRefreshToken, setExpiresIn }}>
        {children}
      </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}