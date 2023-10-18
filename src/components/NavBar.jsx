import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NavBar = () => {
  const {isLogged, setIsLogged} = useAuth();

  return (
    <div>
        <div>
            <NavLink to={"/"}>Home</NavLink>
            {isLogged && <NavLink to={"profile"}>Profile</NavLink>}
            {isLogged && <NavLink to={"store"}>Store</NavLink>}
            {isLogged && <NavLink to={"posts"}>Posts</NavLink>}
        </div>
    </div>
  )
}

export default NavBar