import { useEffect, useState } from 'react'
import { getProfile } from '../services/api'
import { useAuth } from '../components/AuthContext';

function Profile() {
    const[profile, setProfile] = useState(null)
    const[loading, isLoading] = useState(true)

    useEffect(() => {
        getProfile()
            .then((res) => {
                setProfile(res.data)
                isLoading(false)
            })
            .catch((e) => {
                console.error("Error getting profile:", e);
                isLoading(false)
            });
    }, [])

    const { accessToken, setAccessToken, setRefreshToken, setExpiresIn } = useAuth();
    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.slice(1)); 
        console.log(hashParams);
        const auth = hashParams.get("access_token");
        const refresh = hashParams.get("refresh_token");
        const expires = hashParams.get("expires_in");
        console.log("auth:" + auth);
        if (auth) {
            setAccessToken(auth);
            setRefreshToken(refresh);
            setExpiresIn(expires);
          
            // window.location.replace("/profile");
        }

        else{
            window.location.replace("/");
        }
    
            // Clean up the paramerers from the URL
        // window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    if (loading) return <p>Loading...</p>
    if (!profile) return <p>Profile not found.</p>

    return(
        <div>
            <h1>{profile.name}</h1>
            <p>{profile.bio}</p>
            {/* <p>{accessToken}</p> */}
        </div>
    )
};
export default Profile;