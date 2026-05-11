// services/objetoService.ts
import axios from "axios";

export async function cadastrarObjeto({
  objeto,
  categoriasSelecionadas,
  imagem,
  token,
}: {
  objeto: {
    nome: string;
    descricao: string;
    enderecoEncontro: string;
    dataPerdido: string;
    latitude: string;
    longitude: string;
  };
  categoriasSelecionadas: number[];
  imagem: File | null;
  token: string | null;
}) {
  const formData = new FormData();

  Object.entries(objeto).forEach(([key, value]) => {
    formData.append(key, value);
  });

  categoriasSelecionadas.forEach((id) => {
    formData.append("categorias", id.toString());
  });

  if (imagem) {
    formData.append("imagem", imagem);
  }

  return axios.post(
    "http://localhost:8080/objetos/perdidos",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}