import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [publications, setPublications] = useState([])
  const { token, setToken } = useAuth();

  useEffect(() => {
    const profileData = async () => {
      try {
        const response = await axios.get("http://localhost:5353/users", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfile(response.data.user);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
    const publicationsData = async () => {
      try {
        const response = await axios.get("http://localhost:5353/publications", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPublications(response.data.publications)
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    profileData();
    publicationsData();
  }, [token]);
  console.log(profile);



  return (
    <div>
      {profile ? (
        <>
          <img src={profile.profileImage}/>
          <p>Firstname: <span>{profile.firstName}</span></p>
          <p>Lastname: <span>{profile.lastName}</span></p>
          <p>email: <span>{profile.email}</span></p>
        </>
      ) : (
        <p>Loading...</p> // Muestra un mensaje de carga mientras se obtiene el perfil
      )}
      <div>
        {publications ? (
          publications.map((publication) => {return <div key={publication._id}>
            <p>{publication.title}</p>
            <div>
              {publication.images.map((image, index) => (
                <img key={index} src={image} alt={`Image ${index}`} />
              ))}
            </div>
            <p>{publication.text}</p>
            <p>{publication.likes.length}</p>
            <div>
              {publication.comments.map((comment, index) =>(
                <div key={index}>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>})
        ) : ([])}
      </div>
      <Link to={'wishlist'}>Wishlist</Link>

    </div>
  )
}

export default Profile