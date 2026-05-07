// src/services/objetoService.ts
import axios from "axios";

const API_URL = "http://localhost:8080";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// LISTAR OBJETOS
export const listarObjetos = async () => {
  const res = await axios.get(`${API_URL}/objetos`, getAuthHeader());
  return res.data;
};

// BUSCAR OBJETOS
export const buscarObjetos = async (
  termo?: string,
  data?: string,
  categoriaId?: number
) => {
  let url = `${API_URL}/objetos/buscar?`;

  if (termo) url += `termo=${termo}&`;
  if (data) url += `data=${data}&`;
  if (categoriaId) url += `categoria=${categoriaId}&`;

  const res = await axios.get(url, getAuthHeader());
  return res.data;
};

// DELETAR
export const deletarObjeto = async (id: number) => {
  await axios.delete(`${API_URL}/objetos/${id}`, getAuthHeader());
};

// IMAGEM
export const buscarImagem = async (caminho: string) => {
  try {
    const res = await axios.get(`${API_URL}/uploads/${caminho}`, {
      ...getAuthHeader(),
      responseType: "blob",
    });

    return URL.createObjectURL(res.data);
  } catch {
    return null;
  }
};