import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/LOGO_geoachados.png";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import CadastroObjeto from "../components/CadastroObjeto";

function Home() {
  const navigate = useNavigate();

  const irParaAchados = () => navigate("/objetos");
  const irParaPerfil = () => navigate("/perfil");

  const sair = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [menuAberto, setMenuAberto] = useState(false);
  const [popupAberto, setPopupAberto] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);

  const checarAdmin = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8080/auth/admin/check", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAdmin(res.data);
    } catch (error) {
      console.error("Erro ao verificar admin", error);
      setIsAdmin(false);
    }
  };

  const buscarCategorias = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:8080/categorias", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategorias(res.data);
    } catch (err) {
      console.error("Erro ao buscar categorias", err);
    }
  };

  useEffect(() => {
    checarAdmin();
    buscarCategorias();
  }, []);

  return (
    <div className="home-page">

      {/* TOPO */}
      <div className="topbar">
        <img src={logo} alt="GeoAchados e Perdidos" className="logo-top" />

        <div
          className="menu-icon"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰
        </div>
      </div>

      {/* MENU LATERAL */}
      <div className={`sidebar ${menuAberto ? "open" : ""}`}>
        <button onClick={irParaAchados}>Objetos</button>

        {isAdmin && (
          <button onClick={() => navigate("/usuarios")}>
            Usuários
          </button>
        )}

        <button onClick={sair}>Sair</button>
      </div>

      {/* BOTÃO + */}
      <div className="add-button" onClick={() => setPopupAberto(true)}>
        +
      </div>

      {/* MODAL DE CADASTRO */}
      <CadastroObjeto
        aberto={popupAberto}
        onClose={() => setPopupAberto(false)}
        categorias={categorias}
      />

      {/* FUNDO */}
      <div className="mapa-fundo"></div>

    </div>
  );
}

export default Home;