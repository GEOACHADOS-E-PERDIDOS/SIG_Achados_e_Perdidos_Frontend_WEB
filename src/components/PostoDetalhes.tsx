import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PostoDetalhes.css";

import ObjetoDetalhe from "./ObjetoDetalhe";
import {
  buscarObjetoCompleto,
  buscarImagens
} from "../services/ClickMapaService";

type PostoDeRetirada = {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
};

type Props = {
  posto: PostoDeRetirada;
};

export default function PostoDetalhe({ posto }: Props) {
  const [aba, setAba] = useState<"info" | "objetos">("info");
  const [objetos, setObjetos] = useState<any[]>([]);
  const [objetoSelecionado, setObjetoSelecionado] = useState<any | null>(null);

  const token = localStorage.getItem("token");

  // =====================================
  // NORMALIZA OBJETO (PADRÃO DO SISTEMA)
  // =====================================
  const montarObjeto = async (obj: any) => {
    const imagens =
      obj.caminhosImagens?.length > 0
        ? await buscarImagens(obj.caminhosImagens)
        : [];

    return {
      ...obj,
      caminhosImagens: imagens,
      imagemUrl: imagens?.[0] ?? null, // 👈 igual sua página Objetos
    };
  };

  // =====================================
  // CARREGAR OBJETOS
  // =====================================
  useEffect(() => {
    const carregarObjetos = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/objetos/achados/buscar/posto/${posto.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const objs = await Promise.all(
          res.data.map((obj: any) => montarObjeto(obj))
        );

        setObjetos(objs);
      } catch (err) {
        console.error("Erro ao buscar objetos do posto:", err);
      }
    };

    carregarObjetos();
  }, [posto.id]);

  // =====================================
  // CLIQUE OBJETO (IGUAL MAPA)
  // =====================================
  const handleClickObjeto = async (id: number) => {
    try {
      const objeto = await buscarObjetoCompleto(id);

      const imagens = await buscarImagens(objeto.caminhosImagens || []);

      const objetoCompleto = {
        ...objeto,
        caminhosImagens: imagens,
        imagemUrl: imagens?.[0] ?? null,
      };

      setObjetoSelecionado(objetoCompleto);
    } catch (err) {
      console.error("Erro ao buscar objeto:", err);
    }
  };

  return (
    <div className="posto-detalhe">

      {/* ABAS */}
      <div className="posto-abas">
        <button
          className={aba === "info" ? "ativo" : ""}
          onClick={() => setAba("info")}
        >
          Informações
        </button>

        <button
          className={aba === "objetos" ? "ativo" : ""}
          onClick={() => setAba("objetos")}
        >
          Objetos ({objetos.length})
        </button>
      </div>

      {/* INFO */}
      {aba === "info" && (
        <div className="posto-info">
          <h2>{posto.nome}</h2>
          <p><strong>Endereço:</strong> {posto.endereco}</p>
          <p><strong>Telefone:</strong> {posto.telefone}</p>
          <p><strong>Email:</strong> {posto.email}</p>
        </div>
      )}

      {/* OBJETOS */}
      {aba === "objetos" && (
        <div className="objetos-lista-vertical">

          {objetos.length === 0 ? (
            <p>Nenhum objeto encontrado nesse posto.</p>
          ) : (
            objetos.map((obj) => (
              <div
                key={obj.id}
                className="objeto-card-simples"
                onClick={() => handleClickObjeto(obj.id)}
              >

                {/* 👇 IMAGEM IGUAL OBJETOS PAGE */}
                {obj.imagemUrl && (
                  <img
                    src={obj.imagemUrl}
                    alt={obj.nome}
                    className="objeto-card-img"
                  />
                )}

                <h4>{obj.nome}</h4>

                <p className="descricao">
                  {obj.descricao}
                </p>

                <span className="categoria">
                  {obj.categorias?.[0]?.nome ?? "Sem categoria"}
                </span>

              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL (IGUAL MAPA) */}
      {objetoSelecionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setObjetoSelecionado(null)}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "500px",
              maxWidth: "90%",
              maxHeight: "90%",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ObjetoDetalhe obj={objetoSelecionado} />

            <button
              onClick={() => setObjetoSelecionado(null)}
              style={{
                marginTop: "15px",
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                background: "#1976d2",
                color: "white",
                cursor: "pointer",
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}