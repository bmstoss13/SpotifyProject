import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));
    const [expiresIn, setExpiresIn] = useState(localStorage.getItem("expires_in"));
	// max adds:
	const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        console.log(hashParams);
        const auth = hashParams.get("access_token");
        const refresh = hashParams.get("refresh_token");
        const expires = hashParams.get("expires_in");

    if (auth) {
        localStorage.setItem("access_token", auth);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("expires_in", expires);

        setAccessToken(auth);
        setRefreshToken(refresh);
        setExpiresIn(expires);

    // Redirect after login
    //   window.location.replace("/profile");
		window.history.replaceState({}, document.title, "/profile");
    }
	setLoading(false);
    }, []);

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, expiresIn, setAccessToken, setRefreshToken, setExpiresIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
