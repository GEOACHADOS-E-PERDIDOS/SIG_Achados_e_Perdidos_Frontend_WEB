import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";       // Página inicial
import Login from "./pages/Login";     // Tela de login
import CadastroPage from "./pages/CadastroPage"; // Tela de cadastro

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />          {/* Página inicial */}
          <Route path="/" element={<Login />} />   {/* Login */}
          <Route path="/cadastro" element={<CadastroPage />} /> {/* Cadastro */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;