import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Wishlist = () => {
    const [wishlistData, setWishlistData] = useState([])
    const [updateWishlist, setUpdateWishlist] = useState(false)
    const { token, setToken } = useAuth();

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
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    
    console.log(wishlistData);
  return (
    <div>
        {
            wishlistData ? (wishlistData.map((item) => {
                return <div key={item._id}>
                    <img src={item.coverImage} alt="" />
                    <p>{item.gameName}</p>
                    <p>{item.variant[0].price}</p>
                    <p>{item._id}</p>
                    <Link to={`/store/${item._id}`}>see</Link>
                    <button onClick={() => removeToWishlist(item._id)}>X</button>
                </div>
            })) : ([])
        }
    </div>
  )
}

export default Wishlist