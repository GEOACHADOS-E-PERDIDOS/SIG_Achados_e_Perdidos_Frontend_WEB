import React, { useEffect, useState } from "react";

import Topbar from "../components/Topbar";
import Select from "react-select";
import Modal from "react-modal";
import DataInput from "../components/DateInput";

import "../styles/Objetos.css";

import ObjetoCard from "../components/ObjetoCard";
import ObjetoDetalhe from "../components/ObjetoDetalhe";

import type { CategoriaOption } from "../types/Categoria";

import {
  listarObjetos,
  buscarObjetos,
  buscarImagens,
} from "../services/ObjetoPageService";

import { listarCategorias } from "../services/CategoriaService";

function Objetos() {

  const [objetos, setObjetos] =
    useState<any[]>([]);

  const [categorias, setCategorias] =
    useState<CategoriaOption[]>([]);

  const [buscarTermo, setBuscarTermo] =
    useState("");

  const [buscaData, setBuscaData] =
    useState("");

  const [dataSelecionada, setDataSelecionada] =
    useState<Date | null>(null);

  const [
    categoriaSelecionada,
    setCategoriaSelecionada,
  ] = useState<CategoriaOption | null>(null);

  const [
    statusSelecionado,
    setStatusSelecionado,
  ] = useState("");

  const [
    objetoSelecionado,
    setObjetoSelecionado,
  ] = useState<any | null>(null);

  const statusOptions = [
    {
      value: "PERDIDO",
      label: "Perdido",
    },
    {
      value: "DISPONIVEL",
      label: "Disponível",
    },
    {
      value: "DEVOLVIDO",
      label: "Devolvido",
    },
    {
      value: "DESCARTADO",
      label: "Descartado",
    },
  ];

  // =========================
  // NORMALIZA IMAGENS
  // =========================

  const montarObjetoComImagens =
    async (obj: any) => {

      const caminhos: string[] =
        obj.caminhosImagens ?? [];

      const imagens =
        caminhos.length > 0
          ? await buscarImagens(caminhos)
          : [];

      return {
        ...obj,
        caminhosImagens: imagens,
      };
    };

  // =========================
  // CARREGAR OBJETOS
  // =========================

  const carregarObjetos =
    async () => {

      try {

        const data =
          await listarObjetos();

        const objs =
          await Promise.all(
            data.map((obj: any) =>
              montarObjetoComImagens(obj)
            )
          );

        setObjetos(objs);

      } catch (err) {

        console.error(
          "Erro ao carregar objetos:",
          err
        );
      }
    };

  // =========================
  // BUSCAR
  // =========================

  const handleBuscar =
    async () => {

      try {

        const data =
          await buscarObjetos(
            buscarTermo,
            buscaData,
            categoriaSelecionada?.value,
            statusSelecionado
          );

        const objs =
          await Promise.all(
            data.map((obj: any) =>
              montarObjetoComImagens(obj)
            )
          );

        setObjetos(objs);

      } catch (err) {

        console.error(
          "Erro ao buscar objetos:",
          err
        );
      }
    };

  // =========================
  // LIMPAR
  // =========================

  const handleLimpar =
    async () => {

      setBuscarTermo("");

      setBuscaData("");

      setDataSelecionada(null);

      setCategoriaSelecionada(null);

      setStatusSelecionado("");

      await carregarObjetos();
    };



  // =========================
  // INIT
  // =========================

  useEffect(() => {

    carregarObjetos();

    listarCategorias()
      .then(setCategorias)
      .catch((err) =>
        console.error(
          "Erro ao carregar categorias:",
          err
        )
      );

  }, []);

  return (
    <div className="home-page">

      <Topbar />


      <div className="filtro-container">

        <input
          className="input-busca"
          type="text"
          placeholder="Buscar por termo"
          value={buscarTermo}
          onChange={(e) =>
            setBuscarTermo(e.target.value)
          }

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBuscar();
            }
          }}
        />

        <div className="filtro-data filtro-data-objetos"

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBuscar();
            }
          }}>

          <DataInput
            selected={dataSelecionada}
            onChange={(date) => {
              setDataSelecionada(date);

              setBuscaData(
                date
                  ? date.toISOString().split("T")[0]
                  : ""
              );
            }}
            placeholder="Buscar por data"
          />
        </div>

        <div className="filtro-select">
          <Select
            options={categorias}
            value={categoriaSelecionada}
            onChange={(option) =>
              setCategoriaSelecionada(option)
            }
            placeholder="Categoria"
            isClearable
          />
        </div>

        <div className="filtro-select">
          <Select
            options={statusOptions}
            value={
              statusOptions.find(
                (opt) =>
                  opt.value === statusSelecionado
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

        <button
          className="botao-filtro"
          onClick={handleBuscar}
        >
          Buscar
        </button>

        <button
          className="botao-filtro"
          onClick={handleLimpar}
        >
          Limpar
        </button>
      </div>

      {/* LISTA */}

      <div className="lista-objetos">

        {objetos.map((obj) => (

          <ObjetoCard
            key={obj.id}

            obj={{
              ...obj,
              imagemUrl:
                obj.caminhosImagens?.[0]
                ?? null,
            }}


            onClick={() =>
              setObjetoSelecionado(obj)
            }
          />

        ))}

      </div>

      {/* MODAL */}

      <Modal
        isOpen={
          !!objetoSelecionado
        }

        onRequestClose={() =>
          setObjetoSelecionado(
            null
          )
        }

        contentLabel="Detalhes do Objeto"

        style={{
          content: {
            width: "700px",
            maxWidth: "90%",
            inset:
              "50% auto auto 50%",
            transform:
              "translate(-50%, -50%)",
            borderRadius: "10px",
            padding: "30px",
          },

          overlay: {
            backgroundColor:
              "rgba(0,0,0,0.6)",
          },
        }}
      >

        {objetoSelecionado && (
          <ObjetoDetalhe
            obj={objetoSelecionado}
            onClose={() => setObjetoSelecionado(null)} // Adicione esta linha
          />
        )}

        <button
          onClick={() =>
            setObjetoSelecionado(
              null
            )
          }
        >
          Fechar
        </button>

      </Modal>

    </div>
  );
}

export default Objetos;