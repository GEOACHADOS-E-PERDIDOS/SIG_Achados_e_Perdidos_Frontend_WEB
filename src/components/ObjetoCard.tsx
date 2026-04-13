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
  status: "DISPONIVEL" | "DEVOLVIDO" | "DESCARTADO";
};

type Props = {
  obj: Objeto;
  onDelete: (id: number) => void;
  onClick: () => void;
};

export default function ObjetoCard({ obj, onDelete, onClick }: Props) {
  return (
    <div className="card-objeto" onClick={onClick} style={{ cursor: "pointer" }}>      <div className="card-image">
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
        <p>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color:
                obj.status === "DISPONIVEL"
                  ? "green"
                  : obj.status === "DEVOLVIDO"
                    ? "blue"
                    : "red",
              fontWeight: "bold",
            }}
          >
            {obj.status}
          </span>
        </p>
      </div>

      <div
        style={{ cursor: "pointer", padding: "5px", fontSize: "20px" }}
        title="Deletar objeto"
        onClick={(e) => {
          e.stopPropagation(); 
          onDelete(obj.id);
        }}      >
        <img src={deleteIcon} alt="Deletar" style={{ width: "24px" }} />
      </div>
    </div>
  );
}