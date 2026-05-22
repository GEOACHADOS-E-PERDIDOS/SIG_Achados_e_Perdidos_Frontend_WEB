import axios from "axios";

const API_URL = "http://localhost:8080";

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export interface Categoria {
  id: number;
  nome: string;
}

export interface Posto {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  latitude: number;
  longitude: number;
}

class HomeService {

  async checarAdmin(): Promise<boolean> {
    try {

      const response = await axios.get(
        `${API_URL}/auth/admin/check`,
        getHeaders()
      );

      return response.data;

    } catch (error) {

      console.error(
        "Erro ao verificar admin:",
        error
      );

      return false;
    }
  }

  async buscarCategorias(): Promise<Categoria[]> {
    try {

      const response = await axios.get(
        `${API_URL}/categorias`,
        getHeaders()
      );

      return response.data;

    } catch (error) {

      console.error(
        "Erro ao buscar categorias:",
        error
      );

      throw error;
    }
  }

  async buscarPostos(): Promise<Posto[]> {
    try {

      const response = await axios.get(
        `${API_URL}/postos`,
        getHeaders()
      );

      return response.data;

    } catch (error) {

      console.error(
        "Erro ao buscar postos:",
        error
      );

      throw error;
    }
  }

}

export default new HomeService();