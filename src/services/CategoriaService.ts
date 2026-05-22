import axios from "axios";

const API_URL = "http://localhost:8080";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const listarCategorias = async () => {
  const res = await axios.get(`${API_URL}/categorias`, getAuthHeader());

  return res.data.map((cat: any) => ({
    value: cat.id,
    label: cat.nome,
  }));
};