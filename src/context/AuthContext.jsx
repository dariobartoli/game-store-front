import { createContext, useContext, useState } from 'react';

// Crear un contexto
const AuthContext = createContext();

// Proveedor de contexto
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [isLogged, setIsLogged] = useState(localStorage.getItem('logged') || false)


  return (
    <AuthContext.Provider value={{ token, setToken, isLogged, setIsLogged}}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function useAuth() {
  return useContext(AuthContext);
}