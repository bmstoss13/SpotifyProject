import { useEffect, useState } from 'react'
import { getProfile } from '../services/api'
import Sidebar from '../components/Sidebar'
import ProfileEditModal from '../components/ProfileEditModal'

// features:
	// user can edit profile
	// user can choose to display artists/songs from their top songs and liked songs pages
	// can make their profile private (hides from discover page)

function Profile() {
    const[profile, setProfile] = useState(null)
    const[loading, isLoading] = useState(true)
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

    return(
        <div>
			<Sidebar/>
			<h3>Profile</h3>
            <h1>{profile.display_name}</h1>
            <p>{profile.user_bio}</p>
			<h2>Top Artists</h2>
				<p>artists go here</p>
			<h2>Top Songs</h2>
				<p>songs go here</p>
			<button
				className="edit-profile-btn"
				onClick={() => setIsModalOpen(true)}>
				Edit
			</button>

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