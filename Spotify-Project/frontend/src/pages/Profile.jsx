import { useEffect, useState } from 'react'
import { getProfile } from '../services/api'
import Sidebar from '../components/Sidebar'

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

    if (loading) return <p>Loading...</p>
    if (!profile) return <p>Profile not found.</p>

    return(
        <div>
			<Sidebar/>
            <h1>{profile.name}</h1>
            <p>{profile.bio}</p>
        </div>
    )
};
export default Profile;