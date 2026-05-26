import React from "react";

import deleteIcon from "../assets/delete.svg";

import { formatarData } from "../utils/formatarData";

import "../styles/ObjetoCardPerfil.css";

type Categoria = {
  nome: string;
};

type Objeto = {
  id: number;
  nome: string;
  descricao: string;
  enderecoEncontro: string;
  dataEncontro: string;

  imagemUrl?: string | null;

  caminhosImagens?: string[];

  imagens?: string[];

  categorias?: Categoria[];

  status:
    | "DISPONIVEL"
    | "DEVOLVIDO"
    | "DESCARTADO"
    | "PERDIDO"
    | string;
};

type Props = {
  obj: Objeto;

  onDelete: (id: number) => void;

  onEditStatus: (
    id: number,
    statusAtual: string
  ) => void;

  onClick?: () => void;
};

export default function ObjetoCardPerfil({
  obj,
  onDelete,
  onEditStatus,
  onClick,
}: Props) {

  // =========================
  // RESOLVE IMAGEM
  // =========================

  let imagemFinal: string | null = null;

  if (obj.imagemUrl) {

    imagemFinal = obj.imagemUrl;
  }

  else if (
    obj.caminhosImagens &&
    obj.caminhosImagens.length > 0
  ) {

    imagemFinal =
      obj.caminhosImagens[0];
  }

  else if (
    obj.imagens &&
    obj.imagens.length > 0
  ) {

    imagemFinal =
      obj.imagens[0];
  }

  return (

    <div
      className="card-objeto-perfil"
      onClick={onClick}
      style={{
        cursor: onClick
          ? "pointer"
          : "default",
      }}
    >

      {/* IMAGEM */}

      <div
        className="card-image-perfil"
      >

        {imagemFinal ? (

          <img
            src={imagemFinal}
            alt={obj.nome}

            onError={(e) => {

              console.log(
                "ERRO AO CARREGAR:",
                imagemFinal
              );

              e.currentTarget.style.display =
                "none";
            }}
          />

        ) : (

          <div
            className="imagem-placeholder-perfil"
          >
            Sem imagem
          </div>

        )}

      </div>

      {/* TEXTO */}

      <div
        className="card-text-perfil"
      >

        <h3>
          {obj.nome}
        </h3>

        <p className="descricao-curta-perfil">
          {obj.descricao}
        </p>

        <p>
          <strong>Endereço:</strong>{" "}
          {obj.enderecoEncontro}
        </p>

        <p>
          <strong>Data:</strong>{" "}
          {formatarData(
            obj.dataEncontro
          )}
        </p>

        <p>
          <strong>Categorias:</strong>{" "}

          {obj.categorias &&
          obj.categorias.length > 0

            ? obj.categorias
                .map(
                  (cat) => cat.nome
                )
                .join(", ")

            : "Sem categoria"}
        </p>

        <p>
          <strong>Status:</strong>{" "}

          <span
            className={`status-perfil-${obj.status.toLowerCase()}`}
          >

            {obj.status}

          </span>
        </p>

      </div>

      {/* AÇÕES */}

      <div className="card-perfil-acoes">

        <button
            className="btn-perfil-icon"

            onClick={(e) => {

            e.stopPropagation();

            onEditStatus(
                obj.id,
                obj.status
            );
            }}
        >
            ⚙️
        </button>

        <button
            className="btn-perfil-icon delete"

            onClick={(e) => {

            e.stopPropagation();

            onDelete(obj.id);
            }}
        >

            <img
            src={deleteIcon}
            alt="Deletar"
            />

        </button>

      </div>

    </div>
  );
}