import { useState, useEffect } from 'react';

const ProfileEditModal = ({ profileData, onClose, onSubmit }) => {

	const [formData, setFormData] = useState(profileData);

	useEffect(() => {
		setFormData(formData);
	}, [classData]);

	const handleChange = (e) => {

	};

	return (
		<div className="profile-modal-overlay">
			<div className="modal-content">
				<h2>Edit Profile</h2>
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Display Name</label>
						<input
							type="text"
							name="first_name"
							value={formData.first_name}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group">
						<label>Public Profile</label>
					</div>
					<div className="form-group">
						<label>Display Top Artists</label>
					</div>
					<div className="form-group">
						<label>Display Top Songs</label>
					</div>
					<div className="modal-actions">
						<button className='save-btn' type="submit">Save</button>
						<button className="cancel-btn" type="button" onClick={onClose}>Close</button>
					</div>


				</form>
			</div>
		</div>
	)
}

export default ProfileEditModal