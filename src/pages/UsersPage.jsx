import React from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link, useParams} from 'react-router-dom'
import { useState, useEffect} from 'react'
import styles from '../styles/Profile.module.css'

const UsersPage = () => {
    const {token, setToken} = useAuth()
    const [userData, setUserData] = useState({})
    const { id } = useParams();

    useEffect(() => {
        const userProfile = async() => {
            try {
                const response = await axios.get(`http://localhost:5353/users/user/${id}`, {
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
            const response = await axios.post(`http://localhost:5353/users/user/add`, {id}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            alert(response.data.message)
        } catch (error) {
            console.error('Error:', error);
            alert(error.response.data.message)
        }
    }


  return (
    <div className={styles.profile__container}>
        <div className={styles.main__container}>
            <div className={styles.profile__card}>
                <img src={userData.profileImage} alt="" className={styles.profile__image}/>
                <div className={styles.text__container}>
                    <p>First name: <span>{userData.firstName}</span></p>
                    <p>Nick: <span>{userData.nickName}</span></p>
                    <p></p>
                </div>
            </div>
            <span className="material-symbols-outlined" onClick={addFriend}>person_add</span>
        </div>
    </div>
  )
}

export default UsersPage