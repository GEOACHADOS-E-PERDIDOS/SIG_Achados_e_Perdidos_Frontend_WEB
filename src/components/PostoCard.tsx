import React, { useEffect, useState } from "react";
import deleteIcon from "../assets/delete.svg";
import "../styles/PostoCard.css";
import { buscarImagens } from "../services/ObjetoPageService";
import Swal from "sweetalert2";

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
            Sem imagem
          </div>

        )}

      </div>

      <div className="card-text">

        <h3>{posto.nome}</h3>

        <p><strong>Endereço:</strong> {posto.endereco}</p>
        <p><strong>Telefone:</strong> {posto.telefone}</p>
        <p><strong>Email:</strong> {posto.email}</p>

      </div>


      <div className="card-actions">

        <div
            className="card-edit"
            onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
            }}
        >
            🖉
        </div>
        <div
            className="card-delete"
            onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
            }}
        >
            <img
            src={deleteIcon}
            alt="Deletar"
            />
        </div>

        </div>

    </div>
  );
}