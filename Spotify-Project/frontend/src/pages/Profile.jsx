import { useEffect, useState } from 'react'
import { getProfile } from '../services/api'
import Sidebar from '../components/Sidebar'
import ProfileEditModal from '../components/ProfileEditModal'
import { CiUser } from "react-icons/ci";
import SquareContainer from '../components/SquareContainer'
import { FaRegEdit } from "react-icons/fa";

// features:
// user can edit profile
// user can choose to display artists/songs from their top songs and liked songs pages
// can make their profile private (hides from discover page)

function Profile() {

	const [profile, setProfile] = useState(null)
	const [loading, isLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false);

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

	const handleProfileUpdate = (updatedData) => {
		// spotify api stuff goes here
		setProfile(updatedData)
		setIsModalOpen(false)
	};

	if (loading) return <p>Loading...</p>
	if (!profile) return <p>Profile not found.</p>

	return (
		<div className='profile-container'>
			<Sidebar />
			<title>User Profile</title>
			<header className='profile-header'>
				{profile.image ? (
					<img
						className='profile-picture'
						src={profile.image}
						alt='Profile picture'
					/>
				) : (
					<CiUser className='profile-picture fallback-icon' />
				)}
				<div className='profile-overview'>
					{/* <h3>Profile</h3> */}

					<h1>{profile.display_name || "Display Name"}</h1>

					<p>{profile.user_bio}</p>

					{/* !! follower info goes here !! */}
					<div className='follower-edit'>
						<p>Followers: </p>
						<p>Following: </p>
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

				{/* {profile.showTopSongs && ( */}
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
};
export default Profile;