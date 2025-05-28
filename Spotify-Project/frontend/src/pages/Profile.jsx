import { useEffect, useState } from 'react'
import { getProfile } from '../services/api'
<<<<<<< HEAD
import Sidebar from '../components/Sidebar'
import ProfileEditModal from '../components/ProfileEditModal'
import { CiUser } from "react-icons/ci";
import SquareContainer from '../components/SquareContainer'
import { FaRegEdit } from "react-icons/fa";

// features:
// user can edit profile
// user can choose to display artists/songs from their top songs and liked songs pages
// can make their profile private (hides from discover page)
=======
import { useAuth } from '../components/AuthContext';
>>>>>>> ccb3a02eacc7b58442907e21d7383f502c4bc616

function Profile() {

	const [profile, setProfile] = useState(null)
	const [loading, isLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false);

<<<<<<< HEAD
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

					<h1>{profile.profileName || "Display Name"}</h1>

					<p>{profile.bio}</p>

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
=======
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
>>>>>>> ccb3a02eacc7b58442907e21d7383f502c4bc616
};
export default Profile;