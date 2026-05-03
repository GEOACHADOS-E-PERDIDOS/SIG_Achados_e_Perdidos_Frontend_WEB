import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../components/Topbar";
import "../styles/Postos.css";

function Postos() {
  const [postos, setPostos] = useState<any[]>([]);
  const [postoSelecionado, setPostoSelecionado] = useState<any | null>(null);

  const [termo, setTermo] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // LISTAR POSTOS
  // =========================
  const listarPostos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/postos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPostos(res.data);
    } catch (err) {
      console.error("Erro ao listar postos:", err);
    }
  };

  // =========================
  // BUSCAR
  // =========================
  const handleBuscar = async () => {
    try {
        console.log("TERMO:", termo);

      let url = "http://localhost:8080/postos";

      if (termo) {
        url += `?termo=${termo}`;
      }

console.log("URL FINAL:", url);

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPostos(res.data);
    } catch (err) {
      console.error("Erro ao buscar postos:", err);
    }
  };

  // =========================
  // LIMPAR
  // =========================
  const handleLimpar = () => {
    setTermo("");
    listarPostos();
  };

  // =========================
  // DELETE
  // =========================
  const deletarPosto = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/postos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPostos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao deletar posto:", err);
    }
  };

  useEffect(() => {
    listarPostos();
  }, []);

  return (
    <div className="home-page">
      <Topbar />

      <h2 style={{ margin: "20px" }}>Postos de Retirada</h2>

      {/* 🔎 FILTRO CORRIGIDO */}
      <div className="filtro-container">

        <input
          type="text"
          placeholder="Buscar por nome ou endereço"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />

       <button onClick={() => {console.log("🔥 BOTÃO BUSCAR CLICADO");handleBuscar();}}>Buscar</button>
        <button onClick={handleLimpar}>Limpar</button>

      </div>

      {/* LISTA */}
      <div className="lista-postos">
        {postos.map((posto) => (
          <div
            key={posto.id}
            className="card-posto"
            onClick={() => setPostoSelecionado(posto)}
          >
            <h3>{posto.nome}</h3>
            <p>{posto.endereco}</p>
            <p>{posto.telefone}</p>
            <p>{posto.email}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deletarPosto(posto.id);
              }}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {postoSelecionado && (
        <div className="modal-overlay" onClick={() => setPostoSelecionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{postoSelecionado.nome}</h2>
            <p><strong>Endereço:</strong> {postoSelecionado.endereco}</p>
            <p><strong>Telefone:</strong> {postoSelecionado.telefone}</p>
            <p><strong>Email:</strong> {postoSelecionado.email}</p>

            <button onClick={() => setPostoSelecionado(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Postos;