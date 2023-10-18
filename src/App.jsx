import "./App.css";
import Index from "./components/Index";
import { BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom"
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import Publications from "./pages/Publications";
import Games from "./pages/Games";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import { useAuth } from './context/AuthContext'
import { useEffect } from "react";

function App() {
  const {isLogged, setIsLogged} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if(!isLogged){
      navigate('/');
    }
  }, [isLogged]);

  return (
      <div>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path="/profile" element={<Profile/>} />
          <Route path="/store" element={<Store/>}/>
          <Route path="/store/:id" element={<Games/>}/>
          <Route path="/posts" element={<Publications/>}/>
          <Route path="/profile/wishlist" element={<Wishlist/>}/>
          <Route path="/cart" element={<Cart/>}/>
        </Routes>
      </div>
  );
}

export default App;
