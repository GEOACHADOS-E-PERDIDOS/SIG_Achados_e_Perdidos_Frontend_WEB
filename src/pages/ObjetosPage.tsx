import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../components/Topbar";
import deleteIcon from "../assets/delete.svg";
import { useNavigate } from "react-router-dom";
import "../styles/Objetos.css";

function Objetos() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [objetos, setObjetos] = useState<any[]>([]);
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaData, setBuscaData] = useState("");
  const token = localStorage.getItem("token");

  const irParaHome = () => navigate("/home");
  const sair = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Buscar todos os objetos com imagens
  const listarObjetos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/objetos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const objsComImagens = await Promise.all(
        res.data.map(async (obj: any) => {
          if (obj.caminhoImagem) {
            try {
              const imgRes = await axios.get(
                `http://localhost:8080/uploads/${obj.caminhoImagem}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  responseType: "blob",
                }
              );
              const url = URL.createObjectURL(imgRes.data);
              return { ...obj, imagemUrl: url };
            } catch (e) {
              console.error("Erro ao buscar imagem:", obj.caminhoImagem, e);
              return { ...obj, imagemUrl: null };
            }
          } else {
            return { ...obj, imagemUrl: null };
          }
        })
      );

      setObjetos(objsComImagens);
    } catch (error) {
      console.error("Erro ao listar objetos:", error);
    }
  };
  const handleBuscar = async () => {
    try {
      let url = "http://localhost:8080/objetos/buscar?";
      if (buscaNome) url += `nome=${buscaNome}&`;
      if (buscaData) url += `data=${buscaData}&`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const objsComImagens = await Promise.all(
        res.data.map(async (obj: any) => {
          if (obj.caminhoImagem) {
            try {
              const imgRes = await axios.get(
                `http://localhost:8080/uploads/${obj.caminhoImagem}`,
                { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
              );
              const url = URL.createObjectURL(imgRes.data);
              return { ...obj, imagemUrl: url };
            } catch {
              return { ...obj, imagemUrl: null };
            }
          } else {
            return { ...obj, imagemUrl: null };
          }
        })
      );

      setObjetos(objsComImagens);
    } catch (err) {
      console.error("Erro ao buscar objetos:", err);
    }
  };

  const handleLimpar = () => {
    setBuscaNome("");
    setBuscaData("");
    listarObjetos();
  };
  useEffect(() => {
    listarObjetos();
  }, []);

  const deletarObjeto = async (id: number) => {
    if (!window.confirm("Deseja realmente deletar este objeto?")) return;

    try {
      await axios.delete(`http://localhost:8080/objetos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setObjetos(objetos.filter((obj) => obj.id !== id));
    } catch (error) {
      console.error("Erro ao deletar objeto:", error);
      alert("Não foi possível deletar o objeto.");
    }
    handleLimpar();
    listarObjetos();
  };

  return (
    <div className="home-page">
      {/* TOPO */}
      <Topbar />

      {/* FORMULÁRIO DE PESQUISA */}
      <div className="filtro-container">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={buscaNome}
          onChange={(e) => setBuscaNome(e.target.value)}
        />

        <input
          type="date"
          value={buscaData}
          onChange={(e) => setBuscaData(e.target.value)}
        />

        <button onClick={handleBuscar}>Buscar</button>
        <button onClick={handleLimpar}>Limpar</button>
      </div>
      {/* LISTA OBJETOS */}
      <div className="lista-objetos">
        {objetos.map((obj) => (
          <div key={obj.id} className="card-objeto">
            <div className="card-image">
              {obj.imagemUrl ? (
                <img src={obj.imagemUrl} alt={obj.nome} />
              ) : (
                <div className="imagem-placeholder">Sem imagem</div>
              )}
            </div>

            <div className="card-text">
              <h3>{obj.nome}</h3>
              <p>{obj.descricao}</p>
              <p><strong>Endereço:</strong> {obj.enderecoEncontro}</p>
              <p><strong>Data:</strong> {obj.dataEncontro}</p>
              <p>
                <strong>Categorias:</strong>{" "}
                {obj.categorias && obj.categorias.length > 0
                  ? obj.categorias.map((cat: any) => cat.nome).join(", ")
                  : "Sem categoria"}
              </p>
            </div>

            {/* Ícone de deletar */}
            <div
              style={{ cursor: "pointer", padding: "5px", fontSize: "20px" }}
              title="Deletar objeto"
              onClick={() => deletarObjeto(obj.id)}
            >
              <img src={deleteIcon} alt="Deletar" style={{ width: "24px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Objetos;