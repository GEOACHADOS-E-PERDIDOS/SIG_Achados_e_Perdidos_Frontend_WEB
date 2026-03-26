import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from './assets/LOGO_geoachados.png';

import Home from "./pages/Home";       // Página inicial
import Login from "./pages/Login";     // Tela de login
import UserForm from "./components/UserForm"; // Tela de cadastro

function App() {
  return (
    <BrowserRouter>
      <div>
        <img src={logo} alt="GeoAchados e Perdidos" className="logo" />
        <Routes>
          <Route path="/" element={<Home />} />          {/* Página inicial */}
          <Route path="/login" element={<Login />} />   {/* Login */}
          <Route path="/cadastro" element={<UserForm />} /> {/* Cadastro */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;