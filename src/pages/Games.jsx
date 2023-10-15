import React from 'react'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios'

const Games = () => {
    const [game, setGame] = useState([])
    const { id } = useParams();
    
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
    console.log(game);
    

  return (
    <>
        {game ? (
            <div>
                <h2>{game.gameName}</h2>
                <div>
                    <h4>Categories:</h4>
                    <img src={game.coverImage}/>
                    {game.category ? (game.category.map((item) => {
                        return <div>
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
                        </div>
                    })) : ("")}
                    {game.images ? (game.images.map((item) => {
                        return <div>
                            <img src={item}/>
                        </div>
                    })) : ([])}
                    <p>{game.description}</p>
                </div>
            </div>
        ) : (
            []
        )}
    </>
  )
}

export default Games