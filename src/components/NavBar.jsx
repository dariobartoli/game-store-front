import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
  return (
    <div>
        <div>
            <NavLink to={"/"}>Home</NavLink>
            <NavLink to={"profile"}>Profile</NavLink>
        </div>
    </div>
  )
}

export default NavBar