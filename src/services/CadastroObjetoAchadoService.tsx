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

  imagem: File | null;

  postoSelecionado: {
    value: number | string;
  };

  token: string | null;
};

export async function cadastrarObjetoAchado({
  objeto,
  categoriasSelecionadas,
  imagem,
  postoSelecionado,
  token
}: Props) {

  const formData = new FormData();

  // campos básicos
  formData.append("nome", objeto.nome);

  formData.append(
    "descricao",
    objeto.descricao
  );

  formData.append(
    "enderecoEncontro",
    objeto.enderecoEncontro
  );

  formData.append(
    "dataEncontro",
    objeto.dataEncontro
  );

  formData.append(
    "latitudeAchado",
    String(objeto.latitudeAchado)
  );

  formData.append(
    "longitudeAchado",
    String(objeto.longitudeAchado)
  );

  // categorias
  categoriasSelecionadas.forEach((id) => {
    formData.append(
      "categorias",
      id.toString()
    );
  });

  // imagem
  if (imagem) {
    formData.append("imagem", imagem);
  }

  // posto
  formData.append(
    "postoRetiradaId",
    String(postoSelecionado.value)
  );

  return axios.post(
    "http://localhost:8080/objetos/achados",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    }
  );
}