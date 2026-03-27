import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroPage from "./pages/CadastroPage";
import ObjetosPage from "./pages/ObjetosPage";
import PrivateRoute from "./components/PrivateRoute";
import RecuperarSenha from "./pages/RecuperarSenha";
import AlterarSenhaPage from "./pages/AlterarSenhaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        {/*Rotas Privadas*/}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>
        <Route          path="/objetos"element={<PrivateRoute><ObjetosPage /></PrivateRoute>}/>
        <Route path="/alterar-senha" element={<PrivateRoute><AlterarSenhaPage /></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;