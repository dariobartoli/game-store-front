import React from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Logout.module.css'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const { token, setToken } = useAuth()
    const navigate = useNavigate();

    const logout = async() => {
        try {
            const response = await axios.delete('http://localhost:5353/auth/logout', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            })
            localStorage.removeItem("token");
            localStorage.removeItem("logged");
            localStorage.removeItem("userId");
            localStorage.removeItem("deletedRequests")
            localStorage.removeItem('cart')
            navigate('/')
            window.location.reload()
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    
  return (
    <div>
        <button onClick={logout} className={styles.logout__button}>Logout</button>
    </div>
  )
}

export default Logout