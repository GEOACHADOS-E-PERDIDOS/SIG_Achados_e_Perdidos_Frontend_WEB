import axios from "axios";

const API_URL = "http://localhost:8080/postos";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// =========================
// LISTAR POSTOS
// =========================
export const listarPostosService = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

// =========================
// BUSCAR POSTOS
// =========================
export const buscarPostosService = async (termo: string) => {
  const url = termo ? `${API_URL}?termo=${encodeURIComponent(termo)}` : API_URL;

  const res = await axios.get(url, authHeader());
  return res.data;
};

// =========================
// DELETAR POSTO
// =========================
export const deletarPostoService = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`, authHeader());
};