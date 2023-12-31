import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from "react-router-dom";
import styles from '../styles/Store.module.css'

const Store = () => {
    const [games, setGames] = useState([])
    const {cartNumber, setCartNumber, wishlistNumber, apiUrl} = useAuth();

    useEffect(() => {
        const gamesData = async () => {
            try {
              const response = await axios.get(`${apiUrl}products`);
              setGames(response.data.products);
            } catch (error) {
              console.error('Error:', error.message);
            }
          };
        gamesData()
    }, [])

  return (
    <div className={styles.store__container}>
      <div className={styles.main__container}>
        <div className={styles.cart__wish__contain}>
          <Link to={'/cart'} className={styles.cart__icon}><span className={`material-symbols-outlined ${styles.cart}`}>shopping_cart</span><p>{cartNumber}</p></Link>
          <Link to={'/profile/wishlist'} className={styles.wishlistNum}>Wishlist<span>({wishlistNumber})</span></Link>
        </div>
        <div className={styles.games__container}>
          {games ? (
          games.map((item) => {
              return <Link to={`/store/${item._id}`} key={item._id}>
                  <div className={styles.card__games}>
                      <div className={styles.image__container}> 
                        <img src={item.coverImage} alt="" className={styles.store__image}/>
                        <div className={styles.cover__div}></div>
                      </div>
                      <div className={styles.text__container}>
                        <p>$ {item.variant[0].price}</p>
                      </div>
                  </div>
              </Link>
          })) : ([])} 
        </div>
      </div>  
    </div>
  )
}

export default Store