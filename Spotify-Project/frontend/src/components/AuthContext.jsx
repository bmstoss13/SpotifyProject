import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));
    const [expiresIn, setExpiresIn] = useState(localStorage.getItem("expires_in"));

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

        // const refreshInterval = setInterval(() => {
        // fetch(`/auth/refresh_token?refresh_token=${refresh}`)
        //     .then(res => res.json())
        //     .then(data => {
        //         setAccessToken(data.access_token);
        //         setExpiresIn(data.expires_in);
        //         console.log("Access token refreshed");
        //     })
        //     .catch(e => {
        //         console.error("Error refreshing token:", e);
        //     });
        // }, (expires - 60) * 1000); // refresh 60 seconds before expiry

        // return () => clearInterval(refreshInterval);

    // Redirect after login
    //   window.location.replace("/profile");
      }
      console.log(refreshToken);
      console.log(expiresIn);
      if (accessToken && refreshToken && expiresIn) {
        const interval = setInterval(() => {
        fetch(`/auth/refresh_token?refresh_token=${refreshToken}`)
        .then(async res => {
            const text = await res.text();
            try {
            const data = JSON.parse(text);
            if (data.access_token) {
                setAccessToken(data.access_token);
                setExpiresIn(data.expires_in);
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("expires_in", data.expires_in);
                console.log("Access token refreshed");
            } 
            else {
                console.error("No access_token in response", data);
            }
            } 
            catch (e) {
            console.error("Failed to parse JSON response:", text);
            }
        })
        .catch(err => {
            console.error("Error refreshing access token:", err);
        });
            }, (expiresIn - 60) * 1000); // refresh 1 min before expiry

            return () => clearInterval(interval);
        }
    // else{
    //     window.location.replace("/")
    // }
    }, [accessToken, refreshToken, expiresIn]);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        const storedExpiresIn = localStorage.getItem("expires_in");

        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setExpiresIn(parseInt(storedExpiresIn));
        }
    }, []);

    useEffect(() => {
        if (accessToken && refreshToken && expiresIn) {
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            localStorage.setItem("expires_in", expiresIn);
        }
    }, [accessToken, refreshToken, expiresIn]);


  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, expiresIn, setAccessToken, setRefreshToken, setExpiresIn }}>
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
