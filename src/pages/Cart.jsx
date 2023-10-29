import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Cart = () => {
    const [cartData, setCartData] = useState([])
    const [updateData, setUpdateData] = useState(false)
    const [cartNumber, setCartNumber] = useState(localStorage.getItem('cart') || [])
    const { token, setToken } = useAuth();

    useEffect(() => {
        const getCartData = async() => {
            try {
                const response = await axios.get('http://localhost:5353/carts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if(response.data.message == "your cart"){
                    setCartData(response.data.cartUser.gamesInCart)
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
            const response = await axios.delete(`http://localhost:5353/carts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateData(!updateData)
            const updateCart = parseInt(cartNumber) - 1
            localStorage.setItem('cart', updateCart)
            setCartNumber(updateCart)
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const cleanCart = async ()=> {
        try {
            const response = await axios.delete('http://localhost:5353/carts/clean', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateData(!updateData)
            localStorage.removeItem('cart')
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const buyGames = async() => {
        try {
            const response = await axios.post('http://localhost:5353/carts/purchase', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateData(!updateData)
            localStorage.removeItem('cart')
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    
  return (
    <div>
        {cartData.length > 0? (cartData.map((item) => {
            const variant = item.game.variant.find((element) => element._id === item.variant);
            return <div key={item._id}>
                <img src={item.game.coverImage} alt="" />
                <p>{item.game.gameName}</p>
                <p>{variant.price}</p>
                <button onClick={() => removeToCart(item._id)}>X</button>
            </div>
        })) : <p>Cart is empty</p>}
        <button onClick={() => cleanCart()}>clean cart</button>
        <button onClick={() => buyGames()}>buy</button>
    </div>
  )
}

export default Cart