import axios from "axios";

const API_URL = "http://localhost:8080/usuario";

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

class UsuarioPageService {
  
  async listarUsuarios() {
    try {
      const response = await axios.get(
        API_URL,
        getHeaders()
      );

      return response.data;

    } catch (error) {
      console.error(
        "Erro ao listar usuários:",
        error
      );

      throw error;
    }
  }

  async deletarUsuario(id: number) {
    try {
      const response = await axios.delete(
        `${API_URL}/${id}`,
        getHeaders()
      );

      return response.data;

    } catch (error) {
      console.error(
        "Erro ao deletar usuário:",
        error
      );

      throw error;
    }
  }
}

export default new UsuarioPageService();