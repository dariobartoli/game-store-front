import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Library.module.css'
import { Link } from 'react-router-dom'

const Library = () => {
    const {token, setToken, userId} = useAuth()
    const [library, setLibrary] = useState([])

    useEffect(() => {
        const getLibraryData = async() => {
            try {
                const response =  await axios.get(`http://localhost:5353/products/library/${userId}`)
                setLibrary(response.data.library)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        getLibraryData()
    }, [token])


  return (
    <div className={styles.library__container}>
        <div className={styles.main__container}>
            {library.length>0?<h2>YOUR GAMES</h2> : ""}
            <div className={styles.library__box}> 
                {library.length >0? library.map(item => (
                    <div key={item._id} className={styles.library__card}>
                        <img src={item.coverImage} alt="" className={styles.library__image}/>
                        <div className={styles.library__div}>
                            <p>Install</p>
                        </div>
                    </div>
                )) : (<div className={styles.library__anygame}>
                    <p>You don't have any games</p>
                    <Link to={'/store'}>Go to Store</Link>
                    </div>)}
            </div>
        </div>
    </div>
  )
}

export default Library