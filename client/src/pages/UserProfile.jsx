import React, { useState } from 'react';
import axios from 'axios';
import "../styles/style.css";

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return;
    const formData = new FormData();
    formData.append('profileImage', profileImage);

    try {
      setUploading(true);
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploading(false);
      console.log('Image uploaded:', response.data);
    } catch (error) {
      setUploading(false);
      console.error('Error uploading file:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const payload = { username, email, bio };
      const response = await axios.put('/api/user/update', payload);
      console.log('Profile updated:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="user-profile user-profile-page">
      <h2 className="header">User Profile</h2>
      <div className="form-item centered-form-item">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div className="form-item centered-form-item">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div className="form-item centered-form-item">
        <label>
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
      </div>
      <div className="form-item centered-form-item">
        <label>
          Profile Picture:
          <input
            type="file"
            onChange={handleProfileImageChange}
          />
        </label>
      </div>
      <div className="button-container">
        {uploading ? (
          <p>Uploading...</p>
        ) : (
          <button className="profile-button upload" onClick={uploadProfileImage}>
            Upload Image
          </button>
        )}
        <button className="profile-button" onClick={handleUpdateProfile}>
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;