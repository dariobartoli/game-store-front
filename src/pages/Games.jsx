import React from 'react'
import { useState, useEffect, Component } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Games.module.css'
import Carousel from '../components/Carousel'


const Games = () => {
    const [game, setGame] = useState([])
    const [reviews, setReviews] = useState([])
    const [reviewModal, setReviewModal] = useState(false)
    const [reviewText, setReviewText] = useState("")
    const [reviewRecommended, setReviewRecommended] = useState(true)
    const { id } = useParams();
    const { token, userId, apiUrl, profileData, isLogged} = useAuth();
    const [users, setUsers] = useState([]);
    const {cartNumber, setCartNumber, setUpdateDataContext, updateDataContext} = useAuth();
    const [reload, setReload] = useState(false)



    useEffect(() => {
        const fetchData = async () => {
            try {
                // Realiza la solicitud para obtener la información del juego
                const gameResponse = await axios.get(`${apiUrl}products/product/${id}`);
                setGame(gameResponse.data.product);
    
                // Luego de obtener la información del juego, realiza la solicitud para obtener las revisiones
                const reviewsResponse = await axios.get(`${apiUrl}reviews/${gameResponse.data.product._id}`);
                const reviewsShow = reviewsResponse.data.reviews.filter((review) => review.aprobado)
                setReviews(reviewsShow);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        // Llama a fetchData() solo si 'id' existe, para evitar solicitudes innecesarias.
        if (id) {
            fetchData();
        }
    }, [id, reviewModal, reload]);
    
    
    const addWishlist = async(id) => {
        try {
            const response = await axios.post(`${apiUrl}wishlist`, {id}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUpdateDataContext(updateDataContext => !updateDataContext)
            swal({
                title: "Success",
                text: response.data.message,
                icon: "success",
                button: "Close",
            });
        } catch (error) {
            console.error('Error:', error);
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                button: "Close",
            });
        }
    }
    const addToCart = async(id, variant) => {
        try {
            const response = await axios.post(`${apiUrl}carts`, {id, variant}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const updateCart = parseInt(cartNumber) + 1
            setCartNumber(updateCart)
            setUpdateDataContext(!updateDataContext)
            swal({
                title: "Success",
                text: response.data.message,
                icon: "success",
                button: "Close",
            });
        } catch (error) {
            console.error('Error:', error);
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                button: "Close",
            });
        }
    }

    useEffect(() => {
        const userInfo = async(userId) => {
            try {
                const response = await axios(`${apiUrl}users/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                return response.data.user
            } catch (error) {
                console.error('Error', error);
            }
        }
        const promises = reviews.map(item => userInfo(item.userId));

        Promise.all(promises)
            .then(usersData => {
                setUsers(usersData)
            })
            .catch(error => {
                console.error('Error', error);
            })
    }, [reviews])

    const addReview = async(id)=> {
        try {
            const response = await axios.post(`${apiUrl}reviews`, {id:id, text:reviewText, recommended:reviewRecommended}, {
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            setReviewModal(!reviewModal)
            swal({
                title: "Success",
                text: response.data.message,
                icon: "success",
                button: "Close",
            });
        } catch (error) {
            console.error('Error', error);
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                button: "Close",
            });
        }
    }

    const removeReview = async(id) => {
        try {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this review",
                icon: "warning",
                buttons: {
                  cancel: true,
                  confirm: true,
                  confirm: "Sure",
                },
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    const response = await axios.delete(`${apiUrl}reviews/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    setReload(!reload)
                    swal({
                    title: "Success",
                    text: response.data.message,
                    icon: "success",
                    button: "Close",
                    });
                }
            });
        } catch (error) {
            console.error('Error', error);
            swal({
                title: "Error",
                text: error.response.data.message,
                icon: "error",
                button: "Close",
                });
        }
    }
    

    /* CODIGO PARA VERIFICAR SI UN JUEGO YA ESTÁ EN AL WISHLIST, CART O LIBRARY */

    let inLibrary
    let inWishlist
    if(profileData != null){
        inLibrary = profileData.games.includes(game._id)
        inWishlist = profileData.wishlist.includes(game._id)
    }

  return (
    <div className={styles.games__container}>
        <div className={styles.main__container}>
            {isLogged? 
            <div className={styles.cart__wish__contain}>
                <Link to={'/cart'} className={styles.cart__icon}><span className={`material-symbols-outlined ${styles.cart}`}>shopping_cart</span><p>{cartNumber}</p></Link>
                <Link to={'/profile/wishlist'} className={styles.wishlistNum}>Wishlist<span>({profileData? profileData.wishlist.length : null})</span></Link>
            </div>
            : null}
            <div className={styles.games__box}>
                {game ? (
                    <div>
                        <div className={styles.head__contain}>
                            <img src={game.coverImage} className={styles.cover__image}/>
                            <div className={styles.info__contain}>
                                <h2 className={styles.game__title}>{game.gameName}</h2>
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
                                        {inLibrary != undefined && inLibrary? <p className={styles.game__mine} >In your library</p> : <button onClick={() => addToCart(game._id, item._id)} className={styles.button__cart}>Add to Cart</button>}
                                    </section>
                                })) : ("")}
                                {inWishlist != undefined && inWishlist? <p className={styles.game__mine} >In your wishlist</p> : <button onClick={() => addWishlist(game._id)} className={styles.button__wish}>Add to your wishlist</button>}
                            </div>
                        </div>
                        <Carousel images={game.images}/>
                        <div className={styles.description__container}>
                            <h2 className={styles.subtitles}>Description:</h2>
                            <p className={styles.description}>{game.description}</p>
                        </div>
                        <div className={styles.review__title__container}>
                            <h2 className={styles.subtitles}>Reviews:</h2>
                            <button className={styles.button__review} onClick={()=> setReviewModal(!reviewModal)}>Add Review</button>
                        </div>
                        <div className={styles.review__container}>
                            {reviews.length > 0 ? reviews.map((item, index) => (
                                    <div key={index} className={styles.review__box}>
                                        <div>
                                            <Link to={userId == item.userId ? "/profile" : `/user/${item.userId}`} >
                                                {users.filter(user => user._id === item.userId).map(user => (
                                                    <div key={user._id} className={styles.review__head}>
                                                        <img src={user.profileImage} alt="" className={styles.review__image}/>
                                                        <p>{user.nickName}</p>
                                                    </div>
                                                ))}
                                            </Link>
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
                                        {item.userId == userId? <span className={`material-symbols-outlined ${styles.review__remove__icon}`} onClick={()=>removeReview(item._id)}>delete</span> : ""}
                                    </div>
                                )): (<h2 className={styles.text}>This game don't has reviews</h2>)}
                        </div>
                    </div>
                ) : ([])}
            </div>
            <div className={`${styles.review__modal} ${reviewModal? styles.review__modal__view : ""}`}>
                <span className="material-symbols-outlined" onClick={()=> setReviewModal(!reviewModal)}>close</span>
                <textarea name="review" id="review" cols="30" rows="12" className={styles.review__textarea} placeholder="Write your review here..." onChange={e => setReviewText(e.target.value)}></textarea>
                <div>
                    <select name="recommended" id="recommended" className={styles.review__select} onChange={e => setReviewRecommended(e.target.value)}>
                        <option value={true}>Recommended</option>
                        <option value={false}>Not Recommended</option>
                    </select>
                    <button onClick={()=>addReview(game._id)}>Add review</button>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Games