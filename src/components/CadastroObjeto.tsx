import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import type { MultiValue } from "react-select";
import { cadastrarObjeto } from "../services/CadastroObjetoService";
import type { CategoriaOption } from "../types/Categoria";
import DataInput from "./DateInput";
import "../styles/CadastroObjeto.css"


type Props = {
  aberto: boolean;
  onClose: () => void;
  categorias: any[];
};

export default function CadastroObjeto({
  aberto,
  onClose,
  categorias
}: Props) {

  const [objeto, setObjeto] = useState({
    nome: "",
    descricao: "",
    enderecoEncontro: "",
    dataPerdido: "",
    latitude: "",
    longitude: ""
  });
  const [dataPerdido, setdataPerdido] =
    useState<Date | null>(null);
  const [imagem, setImagem] = useState<File | null>(null);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<number[]>([]);

  if (!aberto) return null;


  const limparFormulario = () => {
    setObjeto({
      nome: "",
      descricao: "",
      enderecoEncontro: "",
      dataPerdido: "",
      latitude: "",
      longitude: "",
    });
    setdataPerdido(null);
    setImagem(null);
    setCategoriasSelecionadas([]);
  };

  const handleChange = (e: any) => {
    setObjeto({
      ...objeto,
      [e.target.name]: e.target.value
    });
  };

  const handleImagem = (e: any) => {
    setImagem(e.target.files[0]);
  };

  const handleCategoriasChange = (
    selecionadas: MultiValue<CategoriaOption>
  ) => {
    const ids = selecionadas.map((cat) => cat.value);
    setCategoriasSelecionadas(ids);
  };

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    const token =
      localStorage.getItem("token");

    const dataFormatada =
      dataPerdido
        ? dataPerdido
          .toISOString()
          .split("T")[0]
        : "";

    try {

      await cadastrarObjeto({

        objeto: {
          ...objeto,

          dataPerdido: dataFormatada
        },

        categoriasSelecionadas,

        imagem,

        token,
      });

      alert(
        "Objeto cadastrado com sucesso!"
      );

      limparFormulario();

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        "Erro ao cadastrar objeto"
      );
    }
  };

  const categoriasOptions = categorias.map((cat) => ({
    value: cat.id,
    label: cat.nome
  }));

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Cadastrar Objeto</h2>

        <form onSubmit={handleSubmit}>
          <input name="nome" placeholder="Nome" onChange={handleChange} />
          <input name="descricao" placeholder="Descrição" onChange={handleChange} />
          <input name="enderecoEncontro" placeholder="Endereço" onChange={handleChange} />

          <Select
            isMulti
            options={categoriasOptions}
            onChange={handleCategoriasChange}
          />

          <DataInput
            selected={dataPerdido}
            onChange={setdataPerdido}
          />
          <input name="latitude" placeholder="Latitude" onChange={handleChange} />
          <input name="longitude" placeholder="Longitude" onChange={handleChange} />

          <input type="file" onChange={handleImagem} />

          <button type="submit">Cadastrar</button>
          <button type="button" onClick={() => { limparFormulario(); onClose(); }}>Fechar</button>
        </form>
      </div>
    </div>
  );
}