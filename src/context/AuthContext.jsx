import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'

// Crear un contexto
const AuthContext = createContext();

// Proveedor de contexto
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [isLogged, setIsLogged] = useState(localStorage.getItem('logged') || false)
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null)
  const [cartNumber, setCartNumber] = useState(0)
  const [wishlistNumber, setWishlistNumber] = useState(0)

  useEffect(() => {
    if (isLogged) {
      const getCartData = async() => {
          try {
              const response = await axios.get('http://localhost:5353/carts', {
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              })
              if(response.data.message == "your cart"){
                  setCartNumber(response.data.cartUser.gamesInCart.length)
              }else{
                  setCartNumber(0)
              }
          } catch (error) {
              console.error('Error:', error.message);
          }
      }
      const wishlistNum = async () => {
        try {
          const response = await axios.get("http://localhost:5353/users", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setWishlistNumber(response.data.user.wishlist.length);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      wishlistNum();
      getCartData()
    }
}, [token])


  return (
    <AuthContext.Provider value={{ token, setToken, isLogged, setIsLogged, userId, setUserId, cartNumber, setCartNumber, wishlistNumber, setWishlistNumber}}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function useAuth() {
  return useContext(AuthContext);
}