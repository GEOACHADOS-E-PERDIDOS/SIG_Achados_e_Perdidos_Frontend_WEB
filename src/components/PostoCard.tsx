
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import deleteIcon from "../assets/delete.svg";
import "../styles/PostoCard.css";
import { buscarImagens } from "../services/ObjetoPageService";

type Posto = {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  imagens?: string[];
};

type Props = {
  posto: Posto;
  onClick: () => void;
  onDelete: () => void;
  onEdit?: () => void;
};

export default function PostoCard({
  posto,
  onClick,
  onDelete,
  onEdit
}: Props) {
  const { t } = useTranslation();
  const [imagens, setImagens] = useState<string[]>([]);

  useEffect(() => {
    async function carregar() {
      if (!posto.imagens || posto.imagens.length === 0) {
        setImagens([]);
        return;
      }

      const imgs = await buscarImagens(posto.imagens);
      setImagens(imgs);
    }

    carregar();
  }, [posto.imagens]);

  return (
    <div className="card-posto" onClick={onClick}>
      <div className="card-image">
        {imagens.length > 0 ? (
          <img src={imagens[0]} alt={posto.nome} />
        ) : (
          <div className="imagem-placeholder">
            {t("postoCard.semImagem")}
          </div>
        )}
      </div>

      <div className="card-text">
        <h3>{posto.nome}</h3>

        <p>
          <strong>{t("postoCard.endereco")}:</strong> {posto.endereco}
        </p>

        <p>
          <strong>{t("postoCard.telefone")}:</strong> {posto.telefone}
        </p>

        <p>
          <strong>{t("postoCard.email")}:</strong> {posto.email}
        </p>
      </div>

      <div className="card-actions">
        <div
          className="card-edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          role="button"
          title={t("postoCard.editar")}
          aria-label={t("postoCard.editar")}
        >
          🖉
        </div>

        <div
          className="card-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          role="button"
          title={t("postoCard.deletar")}
          aria-label={t("postoCard.deletar")}
        >
          <img
            src={deleteIcon}
            alt={t("postoCard.deletar")}
          />
        </div>
      </div>
    </div>
  );
}
