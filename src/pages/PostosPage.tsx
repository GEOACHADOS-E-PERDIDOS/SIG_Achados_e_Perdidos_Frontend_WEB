import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import "../styles/Postos.css";

import {
  listarPostosService,
  buscarPostosService,
  deletarPostoService,
} from "../services/PostosPageService";

function PostosPage() {
  const [postos, setPostos] = useState<any[]>([]);
  const [postoSelecionado, setPostoSelecionado] = useState<any | null>(null);
  const [termo, setTermo] = useState("");

  // =========================
  // LISTAR
  // =========================
  const listarPostos = async () => {
    try {
      const data = await listarPostosService();
      setPostos(data);
    } catch (err) {
      console.error("Erro ao listar postos:", err);
    }
  };

  // =========================
  // BUSCAR
  // =========================
  const handleBuscar = async () => {
    try {
      const data = await buscarPostosService(termo);
      setPostos(data);
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
      await deletarPostoService(id);
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

      {/* FILTRO */}
      <div className="filtro-container">
        <input
          type="text"
          placeholder="Buscar por nome ou endereço"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />

        <button onClick={handleBuscar}>Buscar</button>
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
        <div
          className="modal-overlay"
          onClick={() => setPostoSelecionado(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{postoSelecionado.nome}</h2>

            <p>
              <strong>Endereço:</strong> {postoSelecionado.endereco}
            </p>
            <p>
              <strong>Telefone:</strong> {postoSelecionado.telefone}
            </p>
            <p>
              <strong>Email:</strong> {postoSelecionado.email}
            </p>

            <button onClick={() => setPostoSelecionado(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostosPage;