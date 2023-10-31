import "./App.css";
import Index from "./components/Index";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import Publications from "./pages/Publications";
import Games from "./pages/Games";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import UsersPage from "./pages/UsersPage";
import Library from "./pages/Library";

function App() {
  const { isLogged, setIsLogged } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Función para verificar la validez del token
  const checkTokenValidity = () => {
    const token = localStorage.getItem("token");

    if (token) {
      // Verificar la expiración del token (esto depende de cómo esté estructurado tu token)
      const tokenExpiration = getTokenExpiration(token);

      if (tokenExpiration < Date.now() / 1000) {
        // El token ha expirado, redirige al usuario a la página de inicio de sesión
        localStorage.removeItem("token"); // Eliminar el token caducado
        localStorage.removeItem("logged");
        localStorage.removeItem("userId");
        localStorage.removeItem("deletedRequests")
        window.location.href = "/"; // Redirigir al inicio de sesión
      }
    }
  };
  const getTokenExpiration = (token) => {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    return tokenData.exp; // Se asume que el token tiene una propiedad 'exp' con la fecha de expiración en segundos.
  };
  useEffect(() => {
    checkTokenValidity();
    return navigate(checkTokenValidity);
  }, [location.pathname]);

  
  useEffect(() => {
    if (!isLogged) {
      navigate("/");
    }
  }, [isLogged]);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/:id" element={<Games />} />
        <Route path="/posts" element={<Publications />} />
        <Route path="/profile/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/user/:id" element={<UsersPage/>}/>
        <Route path="/library" element={<Library/>}/>
      </Routes>
    </div>
  );
}

export default App;
