import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Cart.module.css'

const Cart = () => {
    const [cartData, setCartData] = useState([])
    const [total, setTotal] = useState(0)
    const {cartNumber, setCartNumber, profileData, updateDataContext, setUpdateDataContext} = useAuth();
    const { token, apiUrl } = useAuth();

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
    }, [updateDataContext])
    
    const removeToCart = async(id) => {
        try {
            const response = await axios.delete(`${apiUrl}carts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateDataContext(!updateDataContext)
            const updateCart = parseInt(cartNumber) - 1
            setCartNumber(updateCart)
        } catch (error) {
            console.error('Error:', error.message);
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                button: "Close",
            });
        }
    }

    const cleanCart = async ()=> {
        try {
            swal({
                title: "Are you sure?",
                text: "You are about to empty your entire shopping cart.",
                icon: "warning",
                buttons: {
                  cancel: true,
                  confirm: true,
                  confirm: "Sure",
                },
                dangerMode: true,
              })
              .then(async (willDelete) => {
                if (willDelete) {
                    const response = await axios.delete(`${apiUrl}carts/clean`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    setUpdateDataContext(!updateDataContext)
                    setCartNumber(0)
                    swal({
                        title: "Success",
                        text: response.data.message,
                        icon: "success",
                        button: "Close",
                    });
                }
              });
        } catch (error) {
            console.error('Error:', error.message);
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                button: "Close",
            });
        }
    }

    const buyGames = () => {
        try {
            swal({
                timer:2500,
                text: "Making the purchase, please wait",
                buttons: false,
                closeOnClickOutside: false,
                closeOnEsc: false,
            }).then(async() => {
                const response = await axios.delete(`${apiUrl}carts/purchase`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                })
                setUpdateDataContext(!updateDataContext)
                setCartNumber(0)
                swal({
                    title: "Success",
                    text: response.data.message,
                    icon: "success",
                    button: "Close",
                });
            })
        } catch (error) {
            console.error('Error:', error.message);
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                button: "Close",
            });
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
                    <div>
                        <p className={styles.cart__total}>${total}</p>
                        <p className={styles.cart__balance}>Your balance: <span>{profileData? profileData.wallet : null}</span></p>
                    </div>
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