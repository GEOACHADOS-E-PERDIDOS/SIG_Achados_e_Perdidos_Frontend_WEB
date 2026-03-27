import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LOGO_geoachados.png";

function Home() {
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);
  const [popupAberto, setPopupAberto] = useState(false);

  return (
    <div className="home-page">

      {/* BARRA SUPERIOR */}
      <div className="topbar">
        <img src={logo} alt="GeoAchados e Perdidos" className="logo-top" />

        <div
          className="menu-icon"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰
        </div>
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${menuAberto ? "open" : ""}`}>

        <h3>Menu</h3>

        <button onClick={() => navigate("/achados")}>Ver Achados</button>
        <button onClick={() => navigate("/perdidos")}>Ver Perdidos</button>
        <button onClick={() => navigate("/perfil")}>Meu Perfil</button>
        <button onClick={() => navigate("/login")}>Sair</button>

      </div>

      {/* BOTÃO + */}
      <div className="add-button" onClick={() => setPopupAberto(true)}>
        +
      </div>

      {/* POPUP CADASTRAR OBJETO */}
      {popupAberto && (
        <div className="popup-overlay">
          <div className="popup">

            <h2>Cadastrar Objeto</h2>

            <input type="text" placeholder="Nome do objeto" />
            <input type="text" placeholder="Local encontrado/perdido" />
            <input type="text" placeholder="Descrição" />

            <button>Cadastrar</button>

            <button
              className="close-btn"
              onClick={() => setPopupAberto(false)}
            >
              Fechar
            </button>

          </div>
        </div>
      )}

      {/* MAPA (por enquanto fundo) */}
      <div className="mapa-fundo"></div>

    </div>
  );
}

export default Home;