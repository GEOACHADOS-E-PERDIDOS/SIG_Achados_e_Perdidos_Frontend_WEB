import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";

import Topbar from "../components/Topbar";
import PostoCard from "../components/PostoCard";
import PostoDetalhe from "../components/PostoDetalhes";
import "../styles/Postos.css"

import {
  listarPostosService,
  buscarPostosService,
  deletarPostoService,
  atualizarPostoService,
} from "../services/PostosPageService";

type Posto = {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  latitude?: number;
  longitude?: number;
  imagens?: string[];
};

function PostosPage() {
  const [postos, setPostos] = useState<Posto[]>([]);
  const [termo, setTermo] = useState("");

  const [postoSelecionado, setPostoSelecionado] = useState<Posto | null>(null);
  const [postoEditando, setPostoEditando] = useState<Posto | null>(null);

  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    latitude: 0,
    longitude: 0,
  });

  // =========================
  // CARREGAR
  // =========================
  const carregarPostos = async () => {
    try {
      const data = await listarPostosService();
      setPostos(data);
    } catch (err) {
      console.error("Erro ao listar postos:", err);
    }
  };

  const buscar = async () => {
    try {
      const data = await buscarPostosService(termo);
      setPostos(data);
    } catch (err) {
      console.error("Erro ao buscar postos:", err);
    }
  };

  const limpar = () => {
    setTermo("");
    carregarPostos();
  };

  // =========================
  // DELETE
  // =========================
  const deletar = async (id: number) => {
    try {
      await deletarPostoService(id);

      setPostos((prev) => prev.filter((p) => p.id !== id));

      await Swal.fire({
        title: "Excluído!",
        text: "Posto removido com sucesso.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      console.error(err);

      Swal.fire({
        title: "Erro",
        text: "Não foi possível excluir o posto.",
        icon: "error",
      });
    }
  };

  // =========================
  // EDITAR
  // =========================
  const abrirEdicao = (posto: Posto) => {
    setPostoEditando(posto);

    setForm({
      nome: posto.nome,
      endereco: posto.endereco,
      telefone: posto.telefone,
      email: posto.email,
      latitude: posto.latitude ?? 0,
      longitude: posto.longitude ?? 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const salvarEdicao = async () => {
    if (!postoEditando) return;

    try {
      const payload = {
        nome: form.nome,
        endereco: form.endereco,
        telefone: form.telefone,
        email: form.email,
        latitude: form.latitude,
        longitude: form.longitude,
      };

      await atualizarPostoService(postoEditando.id, payload);

      await Swal.fire({
        title: "Atualizado!",
        text: "Posto atualizado com sucesso.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      setPostoEditando(null);
      carregarPostos();

    } catch (err) {
      console.error(err);

      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar o posto.",
        icon: "error",
      });
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    carregarPostos();
  }, []);

  return (
    <div className="home-page">
      <Topbar />

      <h2 className="titulo">Postos de Retirada</h2>

      {/* FILTRO */}
      <div className="filtro-container">
        <input
						autoComplete="off"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar por nome ou endereço"
        />

        <button onClick={buscar}>Buscar</button>
        <button onClick={limpar}>Limpar</button>
      </div>

      {/* LISTA */}
      <div className="lista-postos">
        {postos.map((posto) => (
          <PostoCard
            key={posto.id}
            posto={posto}
            onClick={() => setPostoSelecionado(posto)}
            onDelete={() => deletar(posto.id)}
            onEdit={() => abrirEdicao(posto)}
          />
        ))}
      </div>

      {/* DETALHE */}
      {postoSelecionado &&
        createPortal(
          <div className="modal-overlay" onClick={() => setPostoSelecionado(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn-fechar-modal"
                  onClick={() => setPostoSelecionado(null)}
                >
                  ✕
                </button>
              <PostoDetalhe
                posto={postoSelecionado}
                onClose={() => setPostoSelecionado(null)}
              />
            </div>
          </div>,
          document.body
        )}

      {/* EDIT MODAL */}
      {postoEditando &&
        createPortal(
          <div
            className="modal-overlay"
            onClick={() => setPostoEditando(null)}
          >

            <div
              className="modal-editar-posto"
              onClick={(e) => e.stopPropagation()}
            >

              <h2 className="modal-title">
                Editar Posto
              </h2>

              <div className="form-editar-posto">

                <div className="input-group">

                  <label>Nome</label>

                  <input
						autoComplete="off"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Nome do posto"
                  />

                </div>

                <div className="input-group">

                  <label>Endereço</label>

                  <input
						autoComplete="off"
                    name="endereco"
                    value={form.endereco}
                    onChange={handleChange}
                    placeholder="Endereço"
                  />

                </div>

                <div className="input-group">

                  <label>Telefone</label>

                  <input
						autoComplete="off"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="Telefone"
                  />

                </div>

                <div className="input-group">

                  <label>Email</label>

                  <input
						autoComplete="off"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />

                </div>

                <div className="modal-buttons">

                  <button
                    className="btn-salvar-posto"
                    onClick={salvarEdicao}
                  >
                    Salvar
                  </button>

                  <button
                    className="btn-cancelar-posto"
                    onClick={() => setPostoEditando(null)}
                  >
                    Cancelar
                  </button>

                </div>

              </div>

            </div>

          </div>,
          document.body
        )}
    </div>
  );
}

export default PostosPage;