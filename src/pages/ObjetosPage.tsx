import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import Select from "react-select";
import "../styles/Objetos.css";
import ObjetoCard from "../components/ObjetoCard";
import ObjetoDetalhe from "../components/ObjetoDetalhe";
import Modal from "react-modal";

import type { CategoriaOption } from "../types/Categoria";

import {
  listarObjetos,
  buscarObjetos,
  deletarObjeto,
  buscarImagens,
} from "../services/ObjetoPageService";

import { listarCategorias } from "../services/CategoriaService";

function Objetos() {
  const [objetos, setObjetos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);

  const [buscarTermo, setBuscarTermo] = useState("");
  const [buscaData, setBuscaData] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<CategoriaOption | null>(null);

  const [statusSelecionado, setStatusSelecionado] =
  useState("");

  const [objetoSelecionado, setObjetoSelecionado] = useState<any | null>(null);

  const statusOptions = [
  { value: "PERDIDO", label: "Perdido" },
  { value: "DISPONIVEL", label: "Disponível" },
  ];

  // =========================
  // NORMALIZA IMAGENS
  // =========================
  const montarObjetoComImagens = async (obj: any) => {
    const caminhos: string[] = obj.caminhosImagens ?? [];

    const imagens =
      caminhos.length > 0
        ? await buscarImagens(caminhos)
        : [];

    return {
      ...obj,
      caminhosImagens: imagens, // usado pelo ObjetoDetalhe
    };
  };

  // =========================
  // CARREGAR OBJETOS
  // =========================
  const carregarObjetos = async () => {
    try {
      const data = await listarObjetos();

      const objs = await Promise.all(
        data.map((obj: any) => montarObjetoComImagens(obj))
      );

      setObjetos(objs);
    } catch (err) {
      console.error("Erro ao carregar objetos:", err);
    }
  };

  // =========================
  // BUSCAR
  // =========================
  const handleBuscar = async () => {
    try {
      const data = await buscarObjetos(
        buscarTermo,
        buscaData,
        categoriaSelecionada?.value,
        statusSelecionado
      );

      const objs = await Promise.all(
        data.map((obj: any) => montarObjetoComImagens(obj))
      );

      setObjetos(objs);
    } catch (err) {
      console.error("Erro ao buscar objetos:", err);
    }
  };

  // =========================
  // LIMPAR
  // =========================
  const handleLimpar = () => {
    setBuscarTermo("");
    setBuscaData("");
    setCategoriaSelecionada(null);
    setStatusSelecionado("");
    carregarObjetos();
  };

  // =========================
  // DELETAR
  // =========================
  const handleDelete = async (id: number) => {
    try {
      await deletarObjeto(id);
      setObjetos((prev) => prev.filter((obj) => obj.id !== id));
    } catch (err) {
      console.error("Erro ao deletar objeto:", err);
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    carregarObjetos();

    listarCategorias()
      .then(setCategorias)
      .catch((err) =>
        console.error("Erro ao carregar categorias:", err)
      );
  }, []);

  return (
    <div className="home-page">
      <Topbar />

      {/* FILTROS */}
      <div className="filtro-container">
        <input
          type="text"
          placeholder="Buscar por termo"
          value={buscarTermo}
          onChange={(e) => setBuscarTermo(e.target.value)}
        />

        <input
          type="date"
          value={buscaData}
          onChange={(e) => setBuscaData(e.target.value)}
        />

        <div style={{ width: 620 }}>
          <Select
            options={categorias}
            value={categoriaSelecionada}
            onChange={(option) => setCategoriaSelecionada(option)}
            placeholder="Categoria"
            isClearable
          />
        </div>

       <div style={{ width: 620 }}>
        <Select
          options={statusOptions}
          value={
            statusOptions.find(
              (opt) => opt.value === statusSelecionado
            ) || null
          }
          onChange={(option) =>
            setStatusSelecionado(
              option?.value || ""
            )
          }
          placeholder="Status"
          isClearable
        />
      </div>

        <button onClick={handleBuscar}>Buscar</button>
        <button onClick={handleLimpar}>Limpar</button>
      </div>

      {/* LISTA */}
      <div className="lista-objetos">
        {objetos.map((obj) => (
          <ObjetoCard
            key={obj.id}
            obj={{
              ...obj,
              imagemUrl: obj.caminhosImagens?.[0] ?? null, // só 1 imagem no card
            }}
            onDelete={handleDelete}
            onClick={() =>
              setObjetoSelecionado(obj)
            }
          />
        ))}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={!!objetoSelecionado}
        onRequestClose={() => setObjetoSelecionado(null)}
        contentLabel="Detalhes do Objeto"
        style={{
          content: {
            width: "500px",
            maxWidth: "90%",
            inset: "50% auto auto 50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            padding: "20px",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
        }}
      >
        {objetoSelecionado && (
          <ObjetoDetalhe obj={objetoSelecionado} />
        )}

        <button onClick={() => setObjetoSelecionado(null)}>
          Fechar
        </button>
      </Modal>
    </div>
  );
}

export default Objetos;