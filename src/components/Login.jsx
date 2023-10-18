import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'


const Login = ({onClose}) => {
    const [emailOrNick, setEmailOrNick] = useState("")
    const [password, setPassword] = useState("")
    const { token, setToken } = useAuth();
    const {isLogged, setIsLogged} = useAuth();

    
    const login = () => {
        axios.post('http://localhost:5353/auth/login', { emailOrNick, password })
        .then(response => {
          setToken(response.data.token)
          setIsLogged(!isLogged)
          onClose()
  
          // Puedes redirigir al usuario a otra página después del inicio de sesión exitoso si es necesario
          // Por ejemplo, window.location.href = '/dashboard';
        })
        .catch(error => {
          console.error('Error de inicio de sesión:', error);
        });
    }
    

  return (
    <div>
        <input type="text" placeholder='Email or Nick' value={emailOrNick} onChange={e => setEmailOrNick(e.target.value)} />
        <input type="text" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
        <button onClick={login}>Login</button>
    </div>
  )
}

export default Login