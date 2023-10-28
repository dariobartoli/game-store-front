import React from 'react'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Games.module.css'
import Carousel from '../components/Carousel';


const Games = () => {
    const [game, setGame] = useState([])
    const [reviews, setReviews] = useState([])
    const { id } = useParams();
    const { token, setToken } = useAuth();
    
    useEffect(() => {
        const gameData = async () => {
            try {
              const response = await axios.get(`http://localhost:5353/products/product/${id}`);
              setGame(response.data.product);
            } catch (error) {
              console.error('Error:', error);
            }
          };
        gameData()
    }, [])

    useEffect(() => {
        const allReviews = async() => {
            try {
                const response = await axios.get(`http://localhost:5353/reviews/${game._id}`)
                setReviews(response.data.reviews)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        allReviews()
    }, [game])
    
    
    
    const addWishlist = async(id) => {
        try {
            const response = await axios.post('http://localhost:5353/wishlist', {id}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const addToCart = async(id, variant) => {
        try {
            const response = await axios.post('http://localhost:5353/carts', {id, variant}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

  return (
    <div className={styles.games__container}>
        <div className={styles.main__container}>
            <Link to={'/cart'} className={styles.cart}><span className="material-symbols-outlined">shopping_cart</span></Link>
            <div className={styles.games__box}>
                {game ? (
                    <div>
                        <div className={styles.head__contain}>
                            <img src={game.coverImage} className={styles.cover__image}/>
                            <div className={styles.info__contain}>
                                <h2>{game.gameName}</h2>
                                <section>
                                    <h4>Category:</h4>
                                    {game.category ? (game.category.map((item) => {
                                        return <div key={item._id}>
                                            <p className={styles.text}>{item.nameCategory}</p>
                                        </div>
                                    })) : ("")}
                                </section>
                                <section>
                                    <h4>Developer:</h4>
                                    <p className={styles.text}>{game.developer}</p>
                                </section>
                                <section>
                                    <h4>Publisher:</h4>
                                    <p className={styles.text}>{game.publisher}</p>
                                </section>
                                {game.variant ? (game.variant.map((item) => {
                                    return <section key={item._id}>
                                        <h4>{item.edition}:</h4>
                                        <p className={styles.text}>$ {item.price}</p>
                                        <button onClick={() => addToCart(game._id, item._id)} className={styles.button__cart}>Add to Cart</button>
                                    </section>
                                })) : ("")}
                                <button onClick={() => addWishlist(game._id)} className={styles.button__wish}>Add to your wishlist</button>
                            </div>
                        </div>
                        <Carousel images={game.images}/>
                        <div className={styles.description__container}>
                            <h2 className={styles.subtitles}>Description:</h2>
                            <p className={styles.description}>{game.description}</p>
                        </div>
                        <div className={styles.review__title__container}>
                            <h2 className={styles.subtitles}>Reviews:</h2>
                            <button className={styles.button__review}>Add Review</button>
                        </div>
                        <div className={styles.review__container}>
                            {reviews.length > 0 ? reviews.map((item, index) => (
                                    <div key={index} className={styles.review__box}>
                                        <div>
                                            <div>
                                                <img src={item.image} alt="" className={styles.review__image}/>
                                                <p>{item.nick}</p>
                                            </div>
                                            {item.recommended == true?<div className={styles.review__recommended}>
                                                <span className="material-symbols-outlined">thumb_up</span>
                                                <p>Recommended</p>
                                                </div>
                                            : <div className={styles.review__notrecommended}>
                                                <span className="material-symbols-outlined">thumb_down</span>
                                                <p>Not Recommended</p>
                                            </div>}
                                        </div>
                                        <p>{item.text}</p>
                                    </div>
                                )): (<h2 className={styles.text}>This game don't have reviews</h2>)}
                        </div>
                    </div>
                ) : ([])}
            </div>

        </div>
    </div>
  )
}

export default Games