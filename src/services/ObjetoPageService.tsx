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
  categoriaId?: number,
  status?: string
) => {
  let url = `${API_URL}/objetos/buscar?`;

  if (termo) url += `termo=${termo}&`;
  if (data) url += `data=${data}&`;
  if (categoriaId) url += `categoria=${categoriaId}&`;
  if (status) url += `status=${status}&`;

  const res = await axios.get(url, getAuthHeader());
  return res.data;
};

// DELETAR
export const deletarObjeto = async (id: number) => {
  await axios.delete(`${API_URL}/objetos/${id}`, getAuthHeader());
};

// =========================
// IMAGENS (MÚLTIPLAS)
// =========================
export const buscarImagens = async (caminhos?: string[]) => {
  if (!caminhos || caminhos.length === 0) return [];

  try {
    const imagens = await Promise.all(
      caminhos.map(async (caminho) => {
        const res = await axios.get(
          `${API_URL}/uploads/${caminho}`,
          {
            ...getAuthHeader(),
            responseType: "blob",
          }
        );

        return URL.createObjectURL(res.data);
      })
    );

    return imagens;
  } catch (err) {
    console.error("Erro ao buscar imagens:", err);
    return [];
  }
};