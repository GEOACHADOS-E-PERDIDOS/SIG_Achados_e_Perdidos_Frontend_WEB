import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

  const [objetos, setObjetos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [buscarTermo, setBuscarTermo] = useState("");
  const [buscaData, setBuscaData] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<CategoriaOption | null>(null);

  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [objetoSelecionado, setObjetoSelecionado] = useState<any | null>(null);

  const statusOptions = [
    { value: "PERDIDO", label: t("objetos.perdido") },
    { value: "DISPONIVEL", label: t("objetos.disponivel") },
    { value: "DEVOLVIDO", label: t("objetos.devolvido") },
    { value: "DESCARTADO", label: t("objetos.descartado") },
  ];

  // NORMALIZAR IMAGENS
  const montarObjetoComImagens = async (obj: any) => {
    const caminhos: string[] = obj.caminhosImagens ?? [];

    const imagens =
      caminhos.length > 0
        ? await buscarImagens(caminhos)
        : [];

    return {
      ...obj,
      caminhosImagens: imagens,
    };
  };

  // CARREGAR OBJETOS
  const carregarObjetos = async () => {
    try {
      const data = await listarObjetos();

      const objs = await Promise.all(
        data.map((obj: any) => montarObjetoComImagens(obj))
      );

      setObjetos(objs);
    } catch (err) {
      console.error(t("objetos.erroCarregar"), err);
    }
  };

  // BUSCAR
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
      console.error(t("objetos.erroBuscar"), err);
    }
  };

  // LIMPAR FILTROS
  const handleLimpar = async () => {
    setBuscarTermo("");
    setBuscaData("");
    setDataSelecionada(null);
    setCategoriaSelecionada(null);
    setStatusSelecionado("");

    await carregarObjetos();
  };

  // INICIALIZAÇÃO
  useEffect(() => {
    carregarObjetos();

    listarCategorias()
      .then(setCategorias)
      .catch((err) =>
        console.error(t("objetos.erroCategorias"), err)
      );

    // Recarrega as categorias quando o idioma muda,
    // caso os rótulos sejam traduzidos no frontend.
  }, []);

  return (
    <div className="home-page">
      <Topbar />

      <div className="filtro-container">
        <input
          autoComplete="off"
          className="input-busca"
          type="text"
          placeholder={t("objetos.buscarTermo")}
          value={buscarTermo}
          onChange={(e) => setBuscarTermo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBuscar();
            }
          }}
        />

        <div
          className="filtro-data filtro-data-objetos"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBuscar();
            }
          }}
        >
          <DataInput
            selected={dataSelecionada}
            onChange={(date) => {
              setDataSelecionada(date);

              setBuscaData(
                date ? date.toISOString().split("T")[0] : ""
              );
            }}
            placeholder={t("objetos.buscarData")}
          />
        </div>

        <div className="filtro-select">
          <Select
            options={categorias}
            value={categoriaSelecionada}
            onChange={(option) => setCategoriaSelecionada(option)}
            placeholder={t("objetos.categoria")}
            isClearable
            noOptionsMessage={() =>
              i18n.language.startsWith("pt")
                ? "Nenhuma opção disponível"
                : "No options available"
            }
          />
        </div>

        <div className="filtro-select">
          <Select
            options={statusOptions}
            value={
              statusOptions.find(
                (opt) => opt.value === statusSelecionado
              ) || null
            }
            onChange={(option) =>
              setStatusSelecionado(option?.value || "")
            }
            placeholder={t("objetos.status")}
            isClearable
          />
        </div>

        <button className="botao-filtro" onClick={handleBuscar}>
          {t("objetos.buscar")}
        </button>

        <button className="botao-filtro" onClick={handleLimpar}>
          {t("objetos.limpar")}
        </button>
      </div>

      {/* LISTA DE OBJETOS */}
      <div className="lista-objetos">
        {objetos.map((obj) => (
          <ObjetoCard
            key={obj.id}
            obj={{
              ...obj,
              imagemUrl: obj.caminhosImagens?.[0] ?? null,
            }}
            onClick={() => setObjetoSelecionado(obj)}
          />
        ))}
      </div>

      {/* MODAL DE DETALHES */}
      <Modal
        isOpen={!!objetoSelecionado}
        onRequestClose={() => setObjetoSelecionado(null)}
        contentLabel={t("objetos.detalhesObjeto")}
        style={{
          content: {
            width: "700px",
            maxWidth: "90%",
            inset: "50% auto auto 50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            padding: "50px",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
        }}
      >
        {objetoSelecionado && (
          <ObjetoDetalhe
            obj={objetoSelecionado}
            onClose={() => setObjetoSelecionado(null)}
          />
        )}
      </Modal>
    </div>
  );
}

export default Objetos;