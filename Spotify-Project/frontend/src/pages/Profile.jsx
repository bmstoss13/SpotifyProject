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
import '../components/Profile.css';
import { getUserProfile, updateUserProfile, saveSpotifyData } from '../services/firebase-util';
import TopSongs from './TopSongs';
import TopArtists from './TopArtists';

// features:
	// user can edit profile via modal
	// user can choose to display artists/songs from their top songs and liked songs pages
	// user can make their profile private (hides from discover page)

function Profile() {

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [spotifyProfile, setSpotifyProfile] = useState(true);
	const [spotifyLoading, setSpotifyLoading] = useState(true);
	const { accessToken } = useAuth();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (!accessToken) {
			navigate("/"); // redirect back to login if not authenticated (w access token)
			return;
		}

		// getProfile()
		//     .then((res) => {
		//         setProfile(res.data);
		//         isLoading(false);
		//     })
		//     .catch((e) => {
		//         console.error("Error getting profile:", e);
		//         isLoading(false);
		//     });
		// }, [accessToken]);
		const loadData = async () => {
			try {
				// const profileRes = await getProfile();
				// setProfile(profileRes.data);
				// setLoading(false);

				const spotifyProfileData = await getSpotifyProfile(accessToken);
				setSpotifyProfile(spotifyProfileData);
				setSpotifyLoading(false);

				// firebase user data
				const userProfile = await getUserProfile(spotifyProfileData);
				setProfile(userProfile);
				setLoading(false);

			} catch (error) {
				console.error("Error loading data:", error);
				setLoading(false);
				setSpotifyLoading(false);
			}
		}
		loadData();
	}, [accessToken, navigate]);

	const handleProfileUpdate = async (updatedData) => {
		try {
			// update firebase user profile
			const updatedProfile = await updateUserProfile(spotifyProfile, updatedData);
			setProfile(updatedProfile);
			setIsModalOpen(false)
		} catch (error) {
			console.error('Error updating profile:', error);
		}
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
					<div className='name-edit'>
						<h1>{profile.profileName || spotifyProfile?.display_name || "Display Name"}</h1>
						<button
							className="edit-profile-btn"
							onClick={() => setIsModalOpen(true)}>
							<FaRegEdit size={38} />
						</button>
					</div>
				
					<p>{profile.bio}</p>

					<div className='follower-edit'>
						<p>Followers: {spotifyProfile?.followers?.total || 0}</p>
					</div>
				</div>
			</header>
			<div className='profile-body'>
				{profile.showTopArtists && (
				<section>
					<TopArtists/>
				</section>
				)}

				{profile.displayTopSongs && (
				<section>
					<TopSongs/>
				</section>
				)}

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
