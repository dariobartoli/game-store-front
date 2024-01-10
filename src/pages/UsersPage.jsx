import React from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link, useParams} from 'react-router-dom'
import { useState, useEffect} from 'react'
import styles from '../styles/Profile.module.css'

const UsersPage = () => {
    const {token, userId, apiUrl} = useAuth()
    const [userData, setUserData] = useState({})
    const { id } = useParams();

    useEffect(() => {
        const userProfile = async() => {
            try {
                const response = await axios.get(`${apiUrl}users/user/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                console.log(response.data.user);
                setUserData(response.data.user)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        userProfile()
    }, [])

    const addFriend = async() => {
        try {
            const response = await axios.post(`${apiUrl}users/user/add`, {id}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            swal({
                title: "Success",
                text: response.data.message,
                icon: "success",
                button: "Close",
            });
        } catch (error) {
            console.error('Error:', error);
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                button: "Close",
            });
        }
    }



  return (
    <div className={styles.profile__container}>
        <div className={styles.main__container}>
            <div className={styles.wallpaper} style={userData? {backgroundImage: `url(${userData.background})`} : null}>
                <div className={styles.profile__data}>
                    <div className={styles.profile__card}>
                        <img src={userData.profileImage} alt="" className={styles.profile__image}/>
                        <div className={styles.text__container}>
                            {userData.friends && userData.friends.includes(userId) ? null : (
                                <span className={`material-symbols-outlined ${styles.add__friend}`} onClick={addFriend}>person_add</span>
                            )}
                            <p>First name: <span>{userData.firstName}</span></p>
                            <p>Nick: <span>{userData.nickName}</span></p>
                            <p></p>
                        </div>
                    </div>
                    {userData && userData.description? <p className={styles.user__description}>{userData.description}</p> : <p className={styles.user__description}>User don't has description</p>}
                    <div className={styles.user__links__container}>
                        <div className={styles.user__links__div}>
                            <span className="material-symbols-outlined">group</span>
                            <p>Friends</p>
                        </div>
                        <div className={styles.user__links__div}>
                            <span className="material-symbols-outlined">casino</span>
                            <p>Games</p>
                        </div>
                        <div className={styles.user__links__div}>
                            <span className="material-symbols-outlined">list_alt</span>
                            <p>Publications</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UsersPage