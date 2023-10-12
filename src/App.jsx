import { useState } from "react";
import "./App.css";
import axios from "axios";
import Login from "./components/Login";
import Index from "./components/Index";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";

function App() {
/*   axios
    .get("http://localhost:5353/products")
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    }); */

  return (
    <>
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
