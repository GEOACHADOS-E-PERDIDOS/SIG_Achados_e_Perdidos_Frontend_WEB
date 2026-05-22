import { useState } from "react";

import CadastroPostoService 
from "../services/CadastroPostoService";

type Props = {
  aberto: boolean;
  onClose: () => void;
};

export default function CadastroPosto({
  aberto,
  onClose
}: Props) {

  const [posto, setPosto] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    latitude: "",
    longitude: ""
  });

  if (!aberto) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setPosto({
      ...posto,
      [e.target.name]:
      e.target.value
    });

  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await CadastroPostoService
        .cadastrarPosto({

          nome: posto.nome,
          endereco: posto.endereco,
          telefone: posto.telefone,
          email: posto.email,

          latitude: parseFloat(
            posto.latitude
          ),

          longitude: parseFloat(
            posto.longitude
          )
      });

      alert(
        "Posto cadastrado com sucesso!"
      );

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        "Erro ao cadastrar posto"
      );
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">

        <h2>
          Cadastrar Posto
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            name="nome"
            placeholder="Nome"
            onChange={handleChange}
          />

          <input
            name="endereco"
            placeholder="Endereço"
            onChange={handleChange}
          />

          <input
            name="telefone"
            placeholder="Telefone"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            name="latitude"
            placeholder="Latitude"
            onChange={handleChange}
          />

          <input
            name="longitude"
            placeholder="Longitude"
            onChange={handleChange}
          />

          <button type="submit">
            Cadastrar
          </button>

          <button
            type="button"
            onClick={onClose}
          >
            Fechar
          </button>

        </form>

      </div>
    </div>
  );
}