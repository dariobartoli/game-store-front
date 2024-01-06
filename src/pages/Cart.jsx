import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import styles from '../styles/Cart.module.css'

const Cart = () => {
    const [cartData, setCartData] = useState([])
    const [updateData, setUpdateData] = useState(false)
    const [total, setTotal] = useState(0)
    const {cartNumber, setCartNumber, setWishlistNumber} = useAuth();
    const { token, setToken, apiUrl } = useAuth();

    useEffect(() => {
        const getCartData = async() => {
            try {
                const response = await axios.get(`${apiUrl}carts`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.data.message == "your cart"){
                    setCartData(response.data.cartUser.gamesInCart)
                    const data = response.data.cartUser.gamesInCart
                    const totalArr = data.map((item) => item.game.variant.find((element) => element._id === item.variant))
                    const totalGame =  totalArr.reduce((a,b) => a + b.price, 0).toFixed(2)
                    setTotal(totalGame)
                }else{
                    setCartData([])
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
        getCartData()
    }, [updateData])
    
    const removeToCart = async(id) => {
        try {
            const response = await axios.delete(`${apiUrl}carts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateData(!updateData)
            const updateCart = parseInt(cartNumber) - 1
            setCartNumber(updateCart)
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const cleanCart = async ()=> {
        try {
            const response = await axios.delete(`${apiUrl}carts/clean`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateData(!updateData)
            setCartNumber(0)
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const buyGames = async() => {
        try {
            const response = await axios.delete(`${apiUrl}carts/purchase`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
            const responseWishlist = await axios.get(`${apiUrl}wishlist`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const wishlistLength = responseWishlist.data.wishlist.length
            setWishlistNumber(wishlistLength)
            alert(response.data.message)
            setUpdateData(!updateData)
            setCartNumber(0)
        } catch (error) {
            console.error('Error:', error.message);
            alert(error.response.data.message)
        }
    }
    
  return (
    <div className={styles.cart__container}>
        <div className={styles.main__container}>
            <h2 className={styles.title}>YOUR SHOPPING CART</h2>
            <div className={styles.cart__box}>
                {cartData.length > 0? (cartData.map((item) => {
                    const variant = item.game.variant.find((element) => element._id === item.variant);
                    return <div key={item._id} className={styles.cart__card}>
                        <img src={item.game.coverImage} alt="" className={styles.cart__image}/>
                        <p>{item.game.gameName}</p>
                        <div className={styles.cart__card__div}>
                            <p>${variant.price}</p>
                            <span className="material-symbols-outlined" onClick={() => removeToCart(item._id)}>delete</span>
                        </div>
                    </div>
                })) : <p className={styles.cart__empty}>Cart is empty</p>}
                {cartData.length>0?<div className={styles.cart__total__box}>
                    <p className={styles.cart__total}>${total}</p>
                    <div>
                        <button onClick={() => cleanCart()} className={styles.cart__button__clean}>Clean cart</button>
                        <button onClick={buyGames} className={styles.cart__button__buy}>Purchase</button>
                    </div>
                </div>: ""}

            </div>
        </div>
    </div>
  )
}

export default Cart