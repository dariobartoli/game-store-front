import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import styles from '../styles/NavBar.module.css'
import Logout from './Logout'
import Login from './Login'
import Register from './Register'
//import '../styles/navBar.module.css'

const NavBar = () => {
  const {isLogged, setIsLogged} = useAuth();
  const [modal, setModal] = useState(false)
  const [showNavBar, setShowNavBar] = useState(false)
  const [registerModal, setRegisterModal] = useState(false)

  const toggleModal = (authToken, register, all) => {
    setModal(!modal);
    if(authToken){
        setToken(authToken)
    }
    if(register){
      setRegisterModal(!registerModal)
    }else{
      setRegisterModal(false)
    }
    if(all){
      setRegisterModal(false)
      setModal(false);
    }
  };

  const handleClick = ()=>{
    setShowNavBar(!showNavBar)
  }

  return (
    <div className={styles.navBar__module}>
        <div>
          <div className={styles.hambur__icon} onClick={()=> handleClick()}>
            <img src="./img/logo.png" alt="" className={styles.logo__cel}/>
            <span className={`material-symbols-outlined ${styles.menu__icon}`}>menu</span>
          </div>
          <div>
            {isLogged && <Logout/>}
            {!isLogged && <button onClick={() => toggleModal()} className={styles.login__button}>Login</button>}
          </div>
        </div>
        <div className={styles.navBar__container}>
          <nav className={`${styles.navBar__menu} ${showNavBar ? styles.show : ""}`} id="sidebar">
            <NavLink to={"/"} onClick={() => handleClick()} className={(navData) => navData.isActive? styles.active : styles.ancor}>Home</NavLink>
            <NavLink to={"store"} onClick={() => handleClick()} className={(navData) => navData.isActive? styles.active : styles.ancor}>Store</NavLink>
            {isLogged && <NavLink to={"posts"} onClick={() => handleClick()} className={(navData) => navData.isActive? styles.active : styles.ancor}>Posts</NavLink>}
            {isLogged && <NavLink to={"library"} onClick={() => handleClick()} className={(navData) => navData.isActive? styles.active : styles.ancor}>Library</NavLink>}
            {isLogged && <NavLink to={"profile"} onClick={() => handleClick()} className={(navData) => navData.isActive? styles.active : styles.ancor}>Profile</NavLink>}
          </nav>
        </div>
        <img src="./img/logo.png" alt="" className={styles.logo__desk}/>
          {modal == true? <div className={styles.navBar__modal}>
            <Login onClose={toggleModal}/>
        </div> : ""}
        {registerModal? <div className={styles.navBar__modal}>
            <Register onClose={toggleModal}/>
          </div>: ""}
    </div>
  )
}

export default NavBar