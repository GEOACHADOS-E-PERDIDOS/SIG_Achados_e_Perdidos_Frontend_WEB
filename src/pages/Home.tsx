import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LOGO_geoachados.png";

function Home() {
  const navigate = useNavigate();

  const irParaAchados = () => navigate("/achados");
  const irParaPerdidos = () => navigate("/perdidos");
  const irParaPerfil = () => navigate("/perfil");

  return (
    <div className="home-container">
      <img src={logo} alt="GeoAchados e Perdidos" className="home-logo" />
      <h1>Bem-vindo ao GeoAchados e Perdidos!</h1>
      <p>Escolha uma opção para continuar:</p>

      <div className="home-buttons">
        <button onClick={irParaAchados}>Ver Achados</button>
        <button onClick={irParaPerdidos}>Ver Perdidos</button>
        <button onClick={irParaPerfil}>Meu Perfil</button>
      </div>
    </div>
  );
}

export default Home;