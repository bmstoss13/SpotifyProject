import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProfileEditModal from '../components/ProfileEditModal';
import { CiUser } from "react-icons/ci";
import SquareContainer from '../components/SquareContainer'; 
import { FaRegEdit } from "react-icons/fa";
import { useAuth } from '../components/AuthContext';
import { useNavigate, useParams } from "react-router-dom";
import '../components/Profile.css';
import { viewOtherProfs } from '../services/api';

function OtherUserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { accessToken, userId: currentAuthUserId } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userId } = useParams();


    console.log("Current profile state in render:", profile);
    console.log("Current loading state in render:", loading);

    useEffect(() => {
        if (!accessToken) {
            navigate("/");
            return;
        }

        console.log("useEffect running for userId:", userId);

        const loadData = async () => {
            try {
                setLoading(true);

                const response = await viewOtherProfs(userId);
                const fetchedProfileData = response.data; 

                console.log("Fetched data from backend (inside try):", fetchedProfileData);

                if (fetchedProfileData && Object.keys(fetchedProfileData).length > 0) {
                     setProfile(fetchedProfileData);
                } else {
                     console.warn("Backend returned empty or null profile for userId:", userId);
                     setProfile(null);
                }

            }
            catch (e){
                console.error("Error loading profile from backend:", e);
                setProfile(null);
            }
            finally{
                console.log("Stopping loading.");
                setLoading(false);
            }
        };
        loadData();
    }, [userId, accessToken, navigate]);


    if (loading) {
        console.log("Rendering: Loading profile...");
        return <p>Loading profile...</p>;
    }
    if (!profile) {
        console.log("Rendering: Profile not found or an error occurred. Current profile:", profile);
        return <p>Profile not found or an error occurred.</p>;
    }

    console.log("Rendering: Displaying profile with data:", profile);

    return (
        <div className='profile-container'>
            <Sidebar />
            <title>User Profile</title>
            <header className='profile-header'>
                {profile.image && typeof profile.image === 'string' && profile.image.trim() !== '' ? (
                    <img
                        className='profile-picture'
                        src={profile.image}
                        alt={`${profile.profileName || 'User'}'s profile picture`}
                    />
                ) : (
                    <CiUser className='profile-picture fallback-icon' />
                )}
                <div className='profile-overview'>
                    <h1>{profile.profileName || "Display Name"}</h1>
                    <p>{profile.bio || "No bio provided."}</p>
                    <div className='follower-edit'>
                        <p>Followers: {profile.followers || 0}</p>
                        {currentAuthUserId === userId && (
                            <button
                                className="edit-profile-btn"
                                onClick={() => setIsModalOpen(true)}>
                                <FaRegEdit size={25} />
                            </button>
                        )}
                    </div>
                </div>
            </header>
            <div className='profile-body'>

                {profile.showTopArtists && (
                    <section>
                        <h2>Top Artists</h2>
                        {profile.topArtists && Array.isArray(profile.topArtists) && profile.topArtists.length > 0 ? (
                            <SquareContainer type={"artists"} top={profile.topArtists} />
                        ) : (
                            <p>No top artists to display.</p>
                        )}
                    </section>
                )}

                {profile.displayTopSongs && (
                    <section>
                        <h2>Top Songs</h2>
                        {profile.topTracks && Array.isArray(profile.topTracks) && profile.topTracks.length > 0 ? (
                            <SquareContainer type={"songs"} top={profile.topTracks} />
                        ) : (
                            <p>No top songs to display.</p>
                        )}
                    </section>
                )}
            </div>

            {currentAuthUserId === userId && (
                 <ProfileEditModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    currentProfile={profile}
                 />
            )}
        </div>
    );
}


export default OtherUserProfile;