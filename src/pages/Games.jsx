import React from 'react'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios'
import { useAuth } from '../context/AuthContext'


const Games = () => {
    const [game, setGame] = useState([])
    const { id } = useParams();
    const { token, setToken } = useAuth();
    
    useEffect(() => {
        const gameData = async () => {
            try {
              const response = await axios.get(`http://localhost:5353/products/product/${id}`);
              setGame(response.data.product);
            } catch (error) {
              console.error('Error:', error.message);
            }
          };
        gameData()
    }, [])

    useEffect(() => {
        const allReviews = async() => {
            try {
                const response = await axios.get(`http://localhost:5353/reviews/${game._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                console.log(response.data.reviews);
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
        allReviews()
    }, [])
    
    
    const addWishlist = async(id) => {
        try {
            const response = await axios.post('http://localhost:5353/wishlist', {id}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        } catch (error) {
            console.error('Error:', error.message);
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
    console.log(game);
    

  return (
    <>
        <Link to={'/cart'}>Cart</Link>
        {game ? (
            <div>
                <h2>{game.gameName}</h2>
                <div>
                    <h4>Categories:</h4>
                    <img src={game.coverImage}/>
                    {game.category ? (game.category.map((item) => {
                        return <div key={item._id}>
                            <p>{item.nameCategory}</p>
                        </div>
                    })
                    ) : (
                        ""
                    )}
                    {game.variant ? (game.variant.map((item) => {
                        return <div key={item._id}>
                            <p>{item.edition}</p>
                            <p>$ {item.price}</p>
                            <button onClick={() => addToCart(game._id, item._id)}>Add to cart</button>
                        </div>
                    })) : ("")}
                    {game.images ? (game.images.map((item) => {
                        return <div key={item._id}>
                            <img src={item}/>
                        </div>
                    })) : ([])}
                    <button onClick={() => addWishlist(game._id)}>Add wishlist</button>
                    <p>{game.description}</p>
{/*                     {game.reviews.length >0 ? game.reviews.map((item) => (
                        <div>

                        </div>
                    )): (<h1>no hay reviewss</h1>)} */}
                </div>
            </div>
        ) : (
            []
        )}
    </>
  )
}

export default Games