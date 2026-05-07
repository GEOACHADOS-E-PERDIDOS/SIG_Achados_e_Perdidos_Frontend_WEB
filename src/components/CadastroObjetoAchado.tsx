import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import type { MultiValue } from "react-select";
import type {  CategoriaOption } from "../types/Categoria";

type PostoOption = {
  value: number;
  label: string;
};

type Props = {
  aberto: boolean;
  onClose: () => void;
  categorias: any[];
  postos: any[];
};

export default function CadastroObjetoAchado({
  aberto,
  onClose,
  categorias,
  postos
}: Props) {

  const [objeto, setObjeto] = useState({
    nome: "",
    descricao: "",
    enderecoEncontro: "",
    dataEncontro: "",
    latitude: "",
    longitude: ""
  });

  const [imagem, setImagem] = useState<File | null>(null);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<number[]>([]);
  const [postoSelecionado, setPostoSelecionado] = useState<any>(null);

  if (!aberto) return null;

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

  const handlePostoChange = (selecionado: any) => {
    setPostoSelecionado({
      value: selecionado?.value,
      label: selecionado?.label,
      latitude: selecionado?.latitude,
      longitude: selecionado?.longitude
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!postoSelecionado) {
      alert("Posto de retirada é obrigatório!");
      return;
    }

    const formData = new FormData();

    // campos básicos
    formData.append("nome", objeto.nome);
    formData.append("descricao", objeto.descricao);
    formData.append("enderecoEncontro", objeto.enderecoEncontro);
    formData.append("dataEncontro", objeto.dataEncontro);

    formData.append("latitudeAchado", String(objeto.latitude));
    formData.append("longitudeAchado", String(objeto.longitude));

    // categorias
    categoriasSelecionadas.forEach((id) => {
      formData.append("categorias", id.toString());
    });

    // imagem
    if (imagem) {
      formData.append("imagem", imagem);
    }

    formData.append(
      "postoRetiradaId",
      String(postoSelecionado.value)
    );

    console.log("POSTO SELECIONADO:", postoSelecionado);


    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8080/objetos/achados",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      alert("Objeto achado cadastrado com sucesso!");
      onClose();

    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar objeto achado");
    }
  };

  const categoriasOptions = categorias.map((cat) => ({
    value: cat.id,
    label: cat.nome
  }));


  console.log("POSTOS DO BACKEND:", postos);
  console.log("PRIMEIRO POSTO REAL:", postos[0]);
  const postosOptions = postos.map((p) => ({
    value: String(p.id),
    label: p.nome,
    latitude: p.latitude,
    longitude: p.longitude
  }));

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Cadastrar Objeto Achado</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="nome"
            placeholder="Nome"
            onChange={handleChange}
          />

          <input
            name="descricao"
            placeholder="Descrição"
            onChange={handleChange}
          />

          <input
            name="enderecoEncontro"
            placeholder="Endereço do encontro"
            onChange={handleChange}
          />

          {/* CATEGORIAS */}
          <Select
            isMulti
            options={categoriasOptions}
            onChange={handleCategoriasChange}
            placeholder="Categorias"
          />

          <input
            type="date"
            name="dataEncontro"
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

          {/* POSTO DE RETIRADA */}
          <Select
            options={postosOptions}
            onChange={handlePostoChange}
            placeholder="Selecione o posto de retirada"
          />

          <input
            type="file"
            onChange={handleImagem}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit">Cadastrar</button>
            <button type="button" onClick={onClose}>
              Fechar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}