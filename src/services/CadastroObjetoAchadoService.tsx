// services/CadastroObjetoAchadoService.ts

import axios from "axios";

type Props = {
  objeto: {
    nome: string;
    descricao: string;
    enderecoEncontro: string;
    dataEncontro: string;
    latitudeAchado: string;
    longitudeAchado: string;
  };

  categoriasSelecionadas: number[];

  imagens: File[];

  postoSelecionado: {
    value: number | string;
  };

  token: string | null;
};

export async function cadastrarObjetoAchado({
  objeto,
  categoriasSelecionadas,
  imagens,
  postoSelecionado,
  token
}: Props) {

  const formData = new FormData();

  /* ========================= */
  /* DADOS DO OBJETO */
  /* ========================= */

  Object.entries(objeto).forEach(

    ([key, value]) => {

      formData.append(
        key,
        value
      );
    }
  );

  /* ========================= */
  /* CATEGORIAS */
  /* ========================= */

  categoriasSelecionadas.forEach(

    (id) => {

      formData.append(
        "categorias",
        id.toString()
      );
    }
  );

  /* ========================= */
  /* IMAGENS */
  /* ========================= */

  imagens.forEach(

    (imagem) => {

      formData.append(
        "imagens",
        imagem
      );
    }
  );

  /* ========================= */
  /* POSTO */
  /* ========================= */

  formData.append(

    "postoRetiradaId",

    String(
      postoSelecionado.value
    )
  );

  /* ========================= */
  /* REQUEST */
  /* ========================= */
console.log("====== FORMDATA ======");

for (const pair of formData.entries()) {

  console.log(
    pair[0],
    pair[1]
  );
}

console.log("======================");
  return axios.post(

    "http://localhost:8080/objetos/achados",

    formData,

    {
      headers: {

        Authorization:
          `Bearer ${token}`,
      },
    }
  );
}