import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/LOGO_geoachados.png";

function Home() {

  const [menuAberto, setMenuAberto] = useState(false);
  const [popupAberto, setPopupAberto] = useState(false);

  const [objeto, setObjeto] = useState({
    nome: "",
    descricao: "",
    enderecoEncontro: "",
    dataEncontro: "",
    latitude: "",
    longitude: ""
  });

  const [imagem, setImagem] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setObjeto({
      ...objeto,
      [e.target.name]: e.target.value
    });
  };

  const handleImagem = (e: any) => {
    setImagem(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(objeto).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imagem) formData.append("imagem", imagem);

    try {
      await axios.post("http://localhost:8080/objetos", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Objeto cadastrado com sucesso!");
      setPopupAberto(false);

    } catch (error) {
      alert("Erro ao cadastrar objeto");
    }
  };

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
        <button>Home</button>
        <button>Achados</button>
        <button>Perdidos</button>
        <button>Meu Perfil</button>
        <button>Sair</button>
      </div>

      {/* BOTÃO + */}
      <div className="add-button" onClick={() => setPopupAberto(true)}>
        +
      </div>

      {/* POPUP */}
      {/* POPUP */}
{popupAberto && (
  <div className="popup-overlay">

    <div className="popup-box">
      <h2>Cadastrar Objeto</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="nome"
          placeholder="Nome do objeto"
          value={objeto.nome}
          onChange={handleChange}
        />

        <input
          type="text"
          name="descricao"
          placeholder="Descrição"
          value={objeto.descricao}
          onChange={handleChange}
        />

        <input
          type="text"
          name="enderecoEncontro"
          placeholder="Endereço"
          value={objeto.enderecoEncontro}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dataEncontro"
          value={objeto.dataEncontro}
          onChange={handleChange}
        />

        <input
          type="text"
          name="latitude"
          placeholder="Latitude"
          value={objeto.latitude}
          onChange={handleChange}
        />

        <input
          type="text"
          name="longitude"
          placeholder="Longitude"
          value={objeto.longitude}
          onChange={handleChange}
        />

        <input type="file" onChange={handleImagem} />

        <button type="submit">Cadastrar</button>
        <button type="button" onClick={() => setPopupAberto(false)}>
          Fechar
        </button>

      </form>
    </div>

  </div>
)}

      {/* FUNDO */}
      <div className="mapa-fundo"></div>

    </div>
  );
}

export default Home;