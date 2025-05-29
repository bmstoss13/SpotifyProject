import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ProfileEditModal from '../components/ProfileEditModal'
import { CiUser } from "react-icons/ci";
import SquareContainer from '../components/SquareContainer'
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

    // Log the profile state directly in the component body (runs on every render)
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
                setLoading(true); // Start loading

                const response = await viewOtherProfs(userId); // Renamed for clarity
                const fetchedProfileData = response.data; // <--- Extract the actual data

                console.log("Fetched data from backend (inside try):", fetchedProfileData); // Now this should show just your profile object

                if (fetchedProfileData && Object.keys(fetchedProfileData).length > 0) {
                    setProfile(fetchedProfileData); // <--- Set the state with the extracted data
                } else {
                    console.warn("Backend returned empty or null profile for userId:", userId);
                    setProfile(null);
                }

            }
            catch (e){
                console.error("Error loading profile from backend:", e);
                setProfile(null); // Ensure profile is null on error
            }
            finally{
                console.log("Stopping loading.");
                setLoading(false); // Always stop loading, regardless of success or error
            }
        };
        loadData();
    }, [userId, accessToken, navigate]);


    // Your early return conditions
    if (loading) {
        console.log("Rendering: Loading profile...");
        return <p>Loading profile...</p>;
    }
    if (!profile) {
        console.log("Rendering: Profile not found or an error occurred. Current profile:", profile);
        return <p>Profile not found or an error occurred.</p>;
    }

    // If we reach here, profile should be a non-null, non-empty object
    console.log("Rendering: Displaying profile with data:", profile);

    return (
        <div className='profile-container'>
            <Sidebar />
            <title>User Profile</title>
            <header className='profile-header'>
                {/* Check if profile.image exists and is a non-empty string */}
                {profile.image && typeof profile.image === 'string' && profile.image.trim() !== '' ? (
                    <img
                        className='profile-picture'
                        src={profile.image}
                        alt={`${profile.profileName || 'User'}'s profile picture`} // Better alt text
                    />
                ) : (
                    <CiUser className='profile-picture fallback-icon' />
                )}
                <div className='profile-overview'>
                    {/* Use profile.profileName, with a fallback */}
                    <h1>{profile.profileName || "Display Name"}</h1>
                    {/* Use profile.bio, with a fallback */}
                    <p>{profile.bio || "No bio provided."}</p>
                    <div className='follower-edit'>
                        {/* Use profile.followers, with a fallback */}
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
                {/* Ensure profile.showTopArtists and profile.topArtists are handled correctly */}
                {profile.showTopArtists && (
                    <section>
                        <h2>Top Artists</h2>
                        {profile.topArtists && Array.isArray(profile.topArtists) && profile.topArtists.length > 0 ? (
                            <ul>
                                {profile.topArtists.map((artist, index) => (
                                    <li key={index}>{artist.name || `Artist ${index + 1}`}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No top artists to display.</p>
                        )}
                    </section>
                )}

                {/* Ensure profile.displayTopSongs and profile.topSongs are handled correctly */}
                {profile.displayTopSongs && (
                    <section>
                        <h2>Top Songs</h2>
                        {profile.topSongs && Array.isArray(profile.topSongs) && profile.topSongs.length > 0 ? (
                            <SquareContainer songs={profile.topSongs} /> // Pass songs prop to SquareContainer
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