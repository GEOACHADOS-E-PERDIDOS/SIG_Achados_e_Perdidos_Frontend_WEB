
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const statusTraduzido = {
    DISPONIVEL: t("objetoCard.statusDisponivel"),
    DEVOLVIDO: t("objetoCard.statusDevolvido"),
    DESCARTADO: t("objetoCard.statusDescartado"),
  };

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
            {t("objetoCard.semImagem")}
          </div>
        )}
      </div>

      {/* TEXTO */}

      <div className="card-text">
        <h3>{obj.nome}</h3>

        <p>{obj.descricao}</p>

        <p>
          <strong>{t("objetoCard.endereco")}:</strong>{" "}
          {obj.enderecoEncontro}
        </p>

        <p>
          <strong>{t("objetoCard.data")}:</strong>{" "}
          {formatarData(obj.dataEncontro)}
        </p>

        <p>
          <strong>{t("objetoCard.categorias")}:</strong>{" "}
          {obj.categorias && obj.categorias.length > 0
            ? obj.categorias
                .map((cat) => cat.nome)
                .join(", ")
            : t("objetoCard.semCategoria")}
        </p>

        <p>
          <strong>{t("objetoCard.status")}:</strong>{" "}
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
            {statusTraduzido[obj.status]}
          </span>
        </p>
      </div>
    </div>
  );
}
