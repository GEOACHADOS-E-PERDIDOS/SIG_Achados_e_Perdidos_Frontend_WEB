import React from "react";
import deleteIcon from "../assets/delete.svg";

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
};

type Props = {
  obj: Objeto;
  onDelete: (id: number) => void;
};

export default function ObjetoCard({ obj, onDelete }: Props) {
  return (
    <div className="card-objeto">
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
        <p>
          <strong>Endereço:</strong> {obj.enderecoEncontro}
        </p>
        <p>
          <strong>Data:</strong> {obj.dataEncontro}
        </p>
        <p>
          <strong>Categorias:</strong>{" "}
          {obj.categorias && obj.categorias.length > 0
            ? obj.categorias.map((cat) => cat.nome).join(", ")
            : "Sem categoria"}
        </p>
      </div>

      <div
        style={{ cursor: "pointer", padding: "5px", fontSize: "20px" }}
        title="Deletar objeto"
        onClick={() => onDelete(obj.id)}
      >
        <img src={deleteIcon} alt="Deletar" style={{ width: "24px" }} />
      </div>
    </div>
  );
}