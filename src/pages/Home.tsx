import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import CadastroObjeto from "../components/CadastroObjeto";
import Mapa from "../components/Mapa";
import CadastroPosto from "../components/CadastroPosto";
import CadastroObjetoAchado from "../components/CadastroObjetoAchado";
import pinPosto from "../assets/icone_posto.png";
import pinAchado from "../assets/icone_achado.png";
import pinPerdido from "../assets/icone_perdido.png"; 

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
  const [popupPostoAberto, setPopupPostoAberto] = useState(false);
  const [popupAchadoAberto, setPopupAchadoAberto] = useState(false);
  const [postos, setPostos] = useState<any[]>([]);

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

  const buscarPostos = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get("http://localhost:8080/postos", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setPostos(res.data);
  } catch (err) {
    console.error("Erro ao buscar postos", err);
  }
};

  useEffect(() => {
    checarAdmin();
    buscarCategorias();
    buscarPostos();
  }, []);

  return (
    <div className="home-page">

  <Topbar />
  <Mapa />

  <div className="legenda-mapa">

    <div className="item-legenda">
      <img src={pinPosto} alt="Posto" />
      <span>Postos de Retirada</span>
    </div>

    <div className="item-legenda">
      <img src={pinAchado} alt="Achado" />
      <span>Objetos Achados</span>
    </div>

    <div className="item-legenda">
      <img src={pinPerdido} alt="Perdido" />
      <span>Objetos Perdidos</span>
    </div>

  </div>


  <div className="add-buttons">

    {isAdmin && (
      <div
        className="add-item"
        onClick={() => setPopupPostoAberto(true)}
      >
        <div className="add-circle">📍</div>
        <span>Cadastrar Posto de Retirada</span>
      </div>
    )}

    <div
      className="add-item"
      onClick={() => setPopupAberto(true)}
    >
      <div className="add-circle">+</div>
      <span>Cadastrar Objeto Perdido</span>
    </div>

    <div
      className="add-item add-item-achado"
      onClick={() => setPopupAchadoAberto(true)}
    >
    <div className="add-circle">✔️</div>
      <span>Cadastrar Objeto Achado</span>
</div>

  </div>

  {/* 🔥 MODAIS */}
  <CadastroObjeto
    aberto={popupAberto}
    onClose={() => setPopupAberto(false)}
    categorias={categorias}
  />

  <CadastroPosto
    aberto={popupPostoAberto}
    onClose={() => setPopupPostoAberto(false)}
  />

  <CadastroObjetoAchado
  aberto={popupAchadoAberto}
  onClose={() => setPopupAchadoAberto(false)}
  categorias={categorias}
  postos={postos}
/>

</div>
  );
}

export default Home;