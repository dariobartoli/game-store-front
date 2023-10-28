import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from "react-router-dom";
import styles from '../styles/Store.module.css'

const Store = () => {
    const [games, setGames] = useState([])

    useEffect(() => {
        const gamesData = async () => {
            try {
              const response = await axios.get("http://localhost:5353/products");
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
        <Link to={'/cart'} className={styles.cart}><span className="material-symbols-outlined">shopping_cart</span></Link>
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
                        <h2>{item.gameName}</h2>
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