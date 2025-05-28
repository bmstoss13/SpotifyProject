import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api";
import { useAuth } from "../components/AuthContext";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, isLoading] = useState(true);
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
        navigate("/"); // redirect back to login if not authenticated (w access token)
        return;
    }

    getProfile()
        .then((res) => {
            setProfile(res.data);
            isLoading(false);
        })
        .catch((e) => {
            console.error("Error getting profile:", e);
            isLoading(false);
        });
    }, [accessToken]);

    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>Profile not found.</p>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.bio}</p>
    </div>
  );
}

export default Profile;
