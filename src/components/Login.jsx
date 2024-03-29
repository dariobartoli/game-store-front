import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Login.module.css'



const Login = ({onClose}) => {
    const [emailOrNick, setEmailOrNick] = useState("")
    const [password, setPassword] = useState("")
    const { token, setToken } = useAuth();
    const {isLogged, setIsLogged} = useAuth();
    const {userId, setUserId, apiUrl} = useAuth();

    
    const login = () => {
        axios.post(`${apiUrl}auth/login`, { emailOrNick, password })
        .then(response => {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token);
          setIsLogged(!isLogged)
          localStorage.setItem('logged', true)
          setUserId(response.data.userId)
          localStorage.setItem('userId', response.data.userId);
          onClose()
          // Puedes redirigir al usuario a otra página después del inicio de sesión exitoso si es necesario
          // Por ejemplo, window.location.href = '/dashboard';
          swal({
            title: "Success",
            text: response.data.message,
            icon: "success",
            button: "Close",
          });
        })
        .catch(error => {
          console.error('Error de inicio de sesión:', error);
          swal({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            button: "Close",
        });
        });
    }

    

  return (
    <div className={styles.modal__container}>
      <div className={styles.login__container}>
        <div className={styles.input__container}>
          <input type="text" placeholder='Email or Nick' value={emailOrNick} onChange={e => setEmailOrNick(e.target.value)} className={styles.login__input}/>
          <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} className={styles.login__input}/>
        </div>
        <div className={styles.button__container}>
          <button onClick={login} className={`${styles.button} ${styles.button__login}`}>Login</button>
          <button onClick={() => onClose(false, true)} className={`${styles.button} ${styles.button__register}`}>Register</button>
        </div>
        <h4 className={styles.forgot__password}>Forgot your password?</h4>
      </div>
      <div className={styles.qr__container}>
        <img src="./img/qr.png" alt="" className={styles.qr}/>
      </div>
      <div className={styles.close__modal} onClick={() => onClose()}><span className="material-symbols-outlined">close</span></div>
    </div>
  )
}

export default Login