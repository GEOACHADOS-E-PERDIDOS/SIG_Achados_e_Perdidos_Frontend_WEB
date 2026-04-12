import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import type { MultiValue } from "react-select";

type CategoriaOption = {
  value: number;
  label: string;
};

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
    dataEncontro: "",
    latitude: "",
    longitude: ""
  });

  const [imagem, setImagem] = useState<File | null>(null);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<number[]>([]);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(objeto).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    categoriasSelecionadas.forEach((id) => {
      formData.append("categorias", id.toString());
    });

    if (imagem) formData.append("imagem", imagem);

    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:8080/objetos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      });

      alert("Objeto cadastrado com sucesso!");
      onClose();
    } catch (error) {
      alert("Erro ao cadastrar objeto");
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

          <input type="date" name="dataEncontro" onChange={handleChange} />
          <input name="latitude" placeholder="Latitude" onChange={handleChange} />
          <input name="longitude" placeholder="Longitude" onChange={handleChange} />

          <input type="file" onChange={handleImagem} />

          <button type="submit">Cadastrar</button>
          <button type="button" onClick={onClose}>Fechar</button>
        </form>
      </div>
    </div>
  );
}