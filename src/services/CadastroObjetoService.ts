// services/objetoService.ts

import axios from "axios";

export async function cadastrarObjeto({
  objeto,
  categoriasSelecionadas,
  imagens,
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

  imagens: File[];

  token: string | null;
}) {

  const formData = new FormData();

  /* ========================= */
  /* DADOS DO OBJETO */
  /* ========================= */

  Object.entries(objeto).forEach(([key, value]) => {

    formData.append(key, value);

  });

  /* ========================= */
  /* CATEGORIAS */
  /* ========================= */

  categoriasSelecionadas.forEach((id) => {

    formData.append(
      "categorias",
      id.toString()
    );

  });

  /* ========================= */
  /* IMAGENS */
  /* ========================= */

  imagens.forEach((imagem) => {

    formData.append(
      "imagens",
      imagem
    );

  });

  /* ========================= */
  /* REQUEST */
  /* ========================= */

  return axios.post(

    "http://localhost:8080/objetos/perdidos",

    formData,

    {
      headers: {

        Authorization: `Bearer ${token}`,
      },
    }
  );
}