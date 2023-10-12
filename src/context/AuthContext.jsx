import { createContext, useContext, useState } from 'react';

// Crear un contexto
const AuthContext = createContext();

// Proveedor de contexto
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function useAuth() {
  return useContext(AuthContext);
}