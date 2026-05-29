import React from "react";

import "../styles/ObjetoCard.css";

import { formatarData } from "../utils/formatarData";

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

  categorias?: Categoria[];

  status:
    | "DISPONIVEL"
    | "DEVOLVIDO"
    | "DESCARTADO";
};

type Props = {
  obj: Objeto;
  onClick: () => void;
};

export default function ObjetoCard({
  obj,
  onClick,
}: Props) {

  return (

    <div
      className="card-objeto"
      onClick={onClick}

      style={{
        cursor: "pointer",
      }}
    >

      {/* IMAGEM */}

      <div className="card-image">

        {obj.imagemUrl ? (

          <img
            src={obj.imagemUrl}
            alt={obj.nome}
          />

        ) : (

          <div className="imagem-placeholder">
            Sem imagem
          </div>

        )}

      </div>

      {/* TEXTO */}

      <div className="card-text">

        <h3>{obj.nome}</h3>

        <p>
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
            style={{
              color:
                obj.status ===
                "DISPONIVEL"

                  ? "green"

                  : obj.status ===
                    "DEVOLVIDO"

                  ? "blue"

                  : "red",

              fontWeight: "bold",
            }}
          >

            {obj.status}

          </span>

        </p>

      </div>

    </div>
  );
}