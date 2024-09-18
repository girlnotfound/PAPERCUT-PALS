// src/pages/UserProfile.jsx

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../utils/mutations';
import "../styles/style.css";
import axios from 'axios';
import { useUser } from '../hooks/useUser';

const UserProfile = () => {
  const [updateUser] = useMutation(UPDATE_USER);
  const { user, loading, refreshUser } = useUser();
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setImageUrl(user.profileImage || '');
    }
  }, [user]);

  const uploadProfileImage = async () => {
    if (!profileImage) return;
    const formData = new FormData();
    formData.append('profileImage', profileImage);
  
    try {
      setUploading(true);
      const response = await axios.post(`http://localhost:3001/api/upload/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      console.log('Image uploaded successfully', response.data);
      setImageUrl(`http://localhost:3001/uploads/${response.data.filename}`);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      setUploading(false);
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUploading(true);
      
      // Upload image if a new one is selected
      let newImageUrl = imageUrl;
      if (profileImage) {
        await uploadProfileImage();
        newImageUrl = imageUrl;
      }

      const { data } = await updateUser({
        variables: { 
          username, 
          email,
          profileImage: newImageUrl
        }
      });

      console.log('Profile updated:', data.updateUser);
      setUploading(false);
      
      // Refresh user data after successful update
      await refreshUser();
    } catch (error) {
      console.error('Error updating profile:', error);
      setUploading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

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
          Profile Picture:
          <input
            type="file"
            onChange={handleProfileImageChange}
          />
        </label>
      </div>

      {imageUrl && <img src={imageUrl} alt="Profile" style={{width: '200px', height: '200px', objectFit: 'cover'}} />}

      <div className="button-container">
        <button 
          className="profile-button" 
          onClick={handleUpdateProfile}
          disabled={uploading}
        >
          {uploading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;