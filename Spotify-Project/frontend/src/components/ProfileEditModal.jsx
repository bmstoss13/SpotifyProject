import { useState, useEffect } from 'react';
import "./Profile.css";

const ProfileEditModal = ({ profileData, onClose, onSubmit }) => {

	const [formData, setFormData] = useState(profileData);

	useEffect(() => {
		setFormData(profileData);
	}, [profileData]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}))
	};

	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit(formData)
	}

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2 className="modal-title">Edit Profile</h2>
				<hr className='hoz-line' />
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Display Name</label>
						<input
							type="text"
							name="profileName"
							value={formData.profileName}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label>Bio</label>
						<input
							type="text"
							name="bio"
							value={formData.bio}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group">
						<label>Public Profile</label>
						<label className="switch">
							<input
								type="checkbox"
								name="isProfilePublic"
								checked={formData.isProfilePublic}
								onChange={handleChange}
							/>
							<span className="slider round"></span>
						</label>
					</div>
					<div className="form-group">
						<label>Display Top Artists</label>
						<label className="switch">
							<input
								type="checkbox"
								name="showTopArtists"
								checked={formData.showTopArtists}
								onChange={handleChange}
							/>
							<span className="slider round"></span>
						</label>
					</div>
					<div className="form-group">
						<label>Display Top Songs</label>
						<label className="switch">
							<input
								type="checkbox"
								name="displayTopSongs"
								checked={formData.displayTopSongs}
								onChange={handleChange}
							/>
							<span className="slider round"></span>
						</label>
					</div>
					<div className="modal-actions">
						<button className='save-btn' type="submit">Save</button>
						<button className="modal-close-btn" type="close" onClick={onClose}>Close</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default ProfileEditModal