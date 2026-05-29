import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Topbar from "../components/Topbar";
import CadastroObjeto from "../components/CadastroObjeto";
import Mapa from "../components/Mapa";
import CadastroPosto from "../components/CadastroPosto";
import CadastroObjetoAchado from "../components/CadastroObjetoAchado";

import pinPosto from "../assets/icone_posto.png";
import pinAchado from "../assets/icone_achado.png";
import pinPerdido from "../assets/icone_perdido.png";

import HomeService from "../services/HomeService";

import type { Categoria, Posto } from "../services/HomeService";

import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const [popupAberto, setPopupAberto] = useState(false);
  const [popupPostoAberto, setPopupPostoAberto] = useState(false);
  const [popupAchadoAberto, setPopupAchadoAberto] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [postos, setPostos] = useState<Posto[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  const carregarPostos = async () => {
      try {
        const postosData =
          await HomeService.buscarPostos();

        setPostos(postosData);

      } catch (error) {
        console.error(error);
      }
    };

  // =========================
  // CARREGAR DADOS INICIAIS
  // =========================
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [admin, categoriasData] =
          await Promise.all([
            HomeService.checarAdmin(),
            HomeService.buscarCategorias()
          ]);

        setIsAdmin(admin);
        setCategorias(categoriasData);
         await carregarPostos();
      } catch (error) {
        console.error(error);
      }
    };

    carregarDados();
  }, []);

  // =========================
  // REFRESH GLOBAL DO MAPA
  // =========================
  const atualizarMapa = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="home-page">
      <Topbar />

      {/* MAPA */}
      <Mapa refreshKey={refreshKey} />

      {/* LEGENDA */}
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

      {/* BOTÕES */}
      <div className="add-buttons">
        {isAdmin && (
          <div
            className="add-item"
            onClick={() => setPopupPostoAberto(true)}
          >
            <div className="add-circle">📍</div>
            <span>Cadastrar Posto</span>
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
          className="add-item"
          onClick={() => setPopupAchadoAberto(true)}
        >
          <div className="add-circle">✔️</div>
          <span>Cadastrar Objeto Achado</span>
        </div>
      </div>

      {/* POPUP OBJETO PERDIDO */}
      <CadastroObjeto
        aberto={popupAberto}
        onClose={() => setPopupAberto(false)}
        categorias={categorias}
        onObjetoCadastrado={() => {
          setPopupAberto(false);
          atualizarMapa();
        }}
      />

      {/* POPUP POSTO */}
      <CadastroPosto
        aberto={popupPostoAberto}
        onClose={() => setPopupPostoAberto(false)}
        onPostoCadastrado={async() => {
          await carregarPostos();
          setPopupPostoAberto(false);
          atualizarMapa();
        }}
      />

      {/* POPUP OBJETO ACHADO */}
      <CadastroObjetoAchado
        aberto={popupAchadoAberto}
        onClose={() => setPopupAchadoAberto(false)}
        categorias={categorias}
        postos={postos}
        onObjetoCadastrado={() => {
          setPopupAchadoAberto(false);
          atualizarMapa();
        }}
      />
    </div>
  );
}

export default Home;