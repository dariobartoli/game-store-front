import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from "react-router-dom";
import styles from '../styles/Store.module.css'
import 'atropos/css'
import Atropos from 'atropos/react';


const Store = () => {
    const [games, setGames] = useState([])
    const {cartNumber, apiUrl, profileData, isLogged} = useAuth();

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
        {isLogged? 
        <div className={styles.cart__wish__contain}>
          <Link to={'/cart'} className={styles.cart__icon}><span className={`material-symbols-outlined ${styles.cart}`}>shopping_cart</span><p>{cartNumber}</p></Link>
          <Link to={'/profile/wishlist'} className={styles.wishlistNum}>Wishlist<span>({profileData? profileData.wishlist.length : null})</span></Link>
        </div>
        : null}
        <div className={styles.games__container}>
          {games ? (
          games.map((item) => {
              return <Link to={`/store/${item._id}`} key={item._id}>
                    <div id="app">
                      <Atropos
                        activeOffset={5}
                        shadowScale={1.05}
                        rotateXMax={1}
                        rotateYMax={1}
                      >
                        <div className={styles.card__games}>
                          <div className={styles.image__container}> 
                            <img src={item.coverImage} alt="" className={styles.store__image}/>
                            <div className={styles.cover__div}></div>
                          </div>
                          <div className={`${styles.text__container}`}>
                            <p>$ {item.variant[0].price}</p>
                          </div>
                        </div>
                      </Atropos>
                    </div>

              </Link>
          })) : <p style={{color: "white"}}>Cargando</p>} 
        </div>
      </div>  
    </div>
  )
}

export default Store