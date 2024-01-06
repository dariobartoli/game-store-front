import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import styles from '../styles/Wishlist.module.css'

const Wishlist = () => {
    const [wishlistData, setWishlistData] = useState([])
    const [updateWishlist, setUpdateWishlist] = useState(false)
    const { token, setToken, wishlistNumber, setWishlistNumber } = useAuth();

    useEffect(() => {
        const wishlistGetData = async() => {
            try {
                const response = await axios.get('http://localhost:5353/wishlist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setWishlistData(response.data.wishlist)
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
        wishlistGetData()
    }, [updateWishlist])

    const removeToWishlist = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5353/wishlist/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateWishlist(!updateWishlist)
            const updateData = parseInt(wishlistNumber) - 1
            setWishlistNumber(updateData)
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    
  return (
    <div className={styles.wishlist__container}>
        <div className={styles.main__container}>
            <h2>Wishlist</h2>
            { wishlistData.length>0 ? (wishlistData.map((item) => {
                    return <div key={item._id} className={styles.wishlist__card}>
                        <img src={item.coverImage} alt="" className={styles.wishlist__image}/>
                        <div className={styles.card__container}>
                            <h4>{item.gameName}</h4>
                            <p>${item.variant[0].price}</p>
                            <div>
                                <Link to={`/store/${item._id}`}><span className={`material-symbols-outlined ${styles.span}`}>feature_search</span></Link>
                                <span  className="material-symbols-outlined" onClick={() => removeToWishlist(item._id)}>delete</span>
                            </div>
                        </div>
                    </div>
                })) : (<p>You don't have any game in your wishlist</p>)
            }
        </div>
    </div>
  )
}

export default Wishlist