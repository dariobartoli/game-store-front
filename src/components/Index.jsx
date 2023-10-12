import React from 'react'
import { useState } from 'react'
import Login from './Login'
import Profile from '../pages/Profile'
import NavBar from './NavBar'
import { useAuth } from '../context/AuthContext'

const Index = () => {
    const [modal, setModal] = useState(false)
    //const [token, setToken] = useState(null)
    const { token, setToken } = useAuth();

    const toggleModal = (authToken) => {
        setModal(!modal);
        if(authToken){
            setToken(authToken)
        }
    };

  return (
    <>
        <header>
            {
                token == null? 
                <div>
                    <p>Games</p>
                    <button onClick={toggleModal}>Login</button>
                </div> :
                <div>
                    <p>Games</p>
                    <p>Profile</p>
                    <p>Logout</p>
                </div>
            }
        </header>
        <main>
            <h1>Todo el catalogo de juegos</h1>
        </main>
        {modal == true? <div>
            <Login onClose={toggleModal}/>
        </div> : ""}
    </>
  )
}

export default Index