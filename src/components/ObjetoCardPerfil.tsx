
import { useTranslation } from "react-i18next";

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
  isPosto?: boolean;

  onDelete: (id: number) => void;

  onEditStatus: (
    id: number,
    statusAtual: string
  ) => void;

  onEditObjeto: (
    obj: Objeto
  ) => void;

  onClick?: () => void;
};

export default function ObjetoCardPerfil({
  obj,
  onDelete,
  onEditStatus,
  onEditObjeto,
  onClick,
  isPosto,
}: Props) {
  const { t } = useTranslation();

  // =========================
  // RESOLVE IMAGEM
  // =========================

  let imagemFinal: string | null = null;

  if (obj.imagemUrl) {
    imagemFinal = obj.imagemUrl;
  } else if (
    obj.caminhosImagens &&
    obj.caminhosImagens.length > 0
  ) {
    imagemFinal = obj.caminhosImagens[0];
  } else if (
    obj.imagens &&
    obj.imagens.length > 0
  ) {
    imagemFinal = obj.imagens[0];
  }

  const podeAlterarStatus =
    obj.status === "PERDIDO" || isPosto;

  // =========================
  // TRADUZ STATUS
  // =========================

  const statusTraduzido: Record<string, string> = {
    DISPONIVEL: t("objetoCardPerfil.statusDisponivel"),
    DEVOLVIDO: t("objetoCardPerfil.statusDevolvido"),
    DESCARTADO: t("objetoCardPerfil.statusDescartado"),
    PERDIDO: t("objetoCardPerfil.statusPerdido"),
  };

  return (
    <div
      className="card-objeto-perfil"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {/* IMAGEM */}

      <div className="card-image-perfil">
        {imagemFinal ? (
          <img
            src={imagemFinal}
            alt={obj.nome}
            onError={(e) => {
              console.log(
                "ERRO AO CARREGAR:",
                imagemFinal
              );

              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="imagem-placeholder-perfil">
            {t("objetoCardPerfil.semImagem")}
          </div>
        )}
      </div>

      {/* TEXTO */}

      <div className="card-text-perfil">
        <h3>{obj.nome}</h3>

        <p className="descricao-curta-perfil">
          {obj.descricao}
        </p>

        <p>
          <strong>{t("objetoCardPerfil.endereco")}:</strong>{" "}
          {obj.enderecoEncontro}
        </p>

        <p>
          <strong>{t("objetoCardPerfil.data")}:</strong>{" "}
          {formatarData(obj.dataEncontro)}
        </p>

        <p>
          <strong>{t("objetoCardPerfil.categorias")}:</strong>{" "}
          {obj.categorias && obj.categorias.length > 0
            ? obj.categorias
                .map((cat) => cat.nome)
                .join(", ")
            : t("objetoCardPerfil.semCategoria")}
        </p>

        <p>
          <strong>{t("objetoCardPerfil.status")}:</strong>{" "}
          <span
            className={`status-perfil-${obj.status.toLowerCase()}`}
          >
            {statusTraduzido[obj.status] || obj.status}
          </span>
        </p>
      </div>

      {/* AÇÕES */}

      <div className="card-perfil-acoes">
        {!isPosto && (
          <>
            <button
              className="btn-perfil-edit"
              onClick={(e) => {
                e.stopPropagation();
                onEditObjeto(obj);
              }}
              aria-label={t("objetoCardPerfil.editar")}
              title={t("objetoCardPerfil.editar")}
            >
              🖉
            </button>

            <button
              className="btn-perfil-icon delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(obj.id);
              }}
              aria-label={t("objetoCardPerfil.deletar")}
              title={t("objetoCardPerfil.deletar")}
            >
              <img
                src={deleteIcon}
                alt={t("objetoCardPerfil.deletar")}
              />
            </button>
          </>
        )}

        {podeAlterarStatus && (
          <button
            className="btn-perfil-icon"
            onClick={(e) => {
              e.stopPropagation();

              onEditStatus(
                obj.id,
                obj.status
              );
            }}
            aria-label={t("objetoCardPerfil.alterarStatus")}
            title={t("objetoCardPerfil.alterarStatus")}
          >
            ⚙️
          </button>
        )}
      </div>
    </div>
  );
}
