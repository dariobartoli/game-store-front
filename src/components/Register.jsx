import { useState } from 'react'
import axios from 'axios'
import styles from '../styles/Register.module.css'
import { useAuth } from '../context/AuthContext'


const Register = ({onClose}) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { apiUrl} = useAuth()


  const registerInApp = async()=> {
    try {
      const response = await axios.post(`${apiUrl}auth/register`, {firstName, lastName, email, password})
      alert("register successful")
      onClose()
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      alert(error.response.data.message)
    }
  }
  return (
    <div className={styles.register__container}>
      <div className={styles.modal__container}>
        <h2>Register in Next</h2>
        <div className={styles.input__container}>
          <div className={styles.input__box}>
            <label htmlFor="firstname">First Name:</label>
            <input type="text" id='firstname' value={firstName} onChange={e => setFirstName(e.target.value)}/>
          </div>
          <div className={styles.input__box}>
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" id='lastname' value={lastName} onChange={e => setLastName(e.target.value)}/>
          </div>
          <div className={styles.input__box}>
            <label htmlFor="email">Email:</label>
            <input type="text" id='email' value={email} onChange={e => setEmail(e.target.value)}/>
          </div>
          <div className={styles.input__box}>
            <label htmlFor="password">Password:</label>
            <input type="password" id='password' value={password} onChange={e => setPassword(e.target.value)}/>
          </div>
        </div>
        <input type="submit" value="Register" onClick={registerInApp} className={styles.button__register}/>
        <div className={styles.close__modal} onClick={() => onClose(false, false, true)}><span class="material-symbols-outlined">close</span></div>
      </div>
    </div>
  )
}

export default Register