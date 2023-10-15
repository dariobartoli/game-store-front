import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from "react-router-dom";

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
    console.log(games);

    


  return (
    <>
        {games ? (
        games.map((item) => {
            return <Link to={`/store/${item._id}`}>
                <div key={item._id}>
                    <img src={item.coverImage} alt="" />
                    <h2>{item.gameName}</h2>
                    <p>$ {item.variant[0].price}</p>
                </div>
            </Link>
        })
        ) : (
        []
        )} 
    </>
  )
}

export default Store