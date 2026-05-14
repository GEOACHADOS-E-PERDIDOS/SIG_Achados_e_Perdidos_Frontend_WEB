import React from "react";
import "../styles/PostoDetalhes.css";

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
  return (
    <div className="posto-detalhe">
      <h2>{posto.nome}</h2>

      <p>
        <strong>Endereço:</strong> {posto.endereco}
      </p>

      <p>
        <strong>Telefone:</strong> {posto.telefone}
      </p>

      <p>
        <strong>Email:</strong> {posto.email}
      </p>
    </div>
  );
}