import { useEffect, useState } from 'react'
import { getProfile } from '../services/api'
import Sidebar from '../components/Sidebar'
import ProfileEditModal from '../components/ProfileEditModal'
import { CiUser } from "react-icons/ci";
import SquareContainer from '../components/SquareContainer'
import { FaRegEdit } from "react-icons/fa";
import { useAuth } from '../components/AuthContext';
import { useNavigate } from "react-router-dom";
import { getSpotifyProfile } from '../services/spotify';

// features:
// user can edit profile
// user can choose to display artists/songs from their top songs and liked songs pages
// can make their profile private (hides from discover page)

function Profile() {

	const [profile, setProfile] = useState(null);
	const [loading, isLoading] = useState(true);
	const [spotifyLoading, setSpotifyLoading] = useState(true);
	const { accessToken } = useAuth();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

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

	const loadSpotifyData = async () => {
		setSpotifyLoading(true);
		try {

			const spotifyProfile = await getSpotifyProfile(accessToken);
			setSpotifyProfile(spotifyProfileData);

		} catch (error) {
			console.error('Error loading Spotify data:', error);
		} finally {
			setSpotifyLoading(false);
		}
	}

	const handleProfileUpdate = async (updatedData) => {
		// spotify api stuff goes here
		// await stepIndicatorClasses(doc(db, "users", userId), updatedData, { merge: true });
		setProfile(updatedData)
		setIsModalOpen(false)
	};

	if (loading) return <p>Loading...</p>;
	if (!profile) return <p>Profile not found.</p>;

	return (
		<div className='profile-container'>
			<Sidebar />
			<title>User Profile</title>
			<header className='profile-header'>
				{(spotifyProfile?.images?.[0]?.url || profile.image) ? (
					<img
						className='profile-picture'
						src={spotifyProfile?.images?.[0]?.url || profile.image}
						alt='Profile picture'
					/>
				) : (
					<CiUser className='profile-picture fallback-icon' />
				)}
				<div className='profile-overview'>
					{/* <h3>Profile</h3> */}

					<h1>{profile.profileName || spotifyProfile?.display_name || "Display Name"}</h1>

					<p>{profile.bio}</p>

					{/* !! follower info goes here !! */}
					<div className='follower-edit'>
						<p>Followers: {spotifyProfile?.followers?.total || 0}</p>
						<button
							className="edit-profile-btn"
							onClick={() => setIsModalOpen(true)}>
							<FaRegEdit size={25} />
						</button>
					</div>
				</div>
			</header>
			<div className='profile-body'>
				{/* {profile.showTopArtists && ( */}
				<section>
					<h2>Top Artists</h2>
					<p>artists go here</p>
				</section>
				{/* )} */}

				{/* {profile.displayTopSongs && ( */}
				<section>
					<h2>Top Songs</h2>
					<SquareContainer />
				</section>
				{/* )} */}

			</div>
			{isModalOpen && (
				<ProfileEditModal
					profileData={profile}
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleProfileUpdate}
				/>
			)}
		</div>
	)
}

export default Profile;
