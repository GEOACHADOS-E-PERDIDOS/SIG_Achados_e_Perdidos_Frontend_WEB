import axios from "axios";

const API_URL = "http://localhost:8080/postos";

interface PostoDTO {
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  latitude: number;
  longitude: number;
}

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

class CadastroPostoService {

  async cadastrarPosto(
    posto: PostoDTO
  ) {
    try {

      const response = await axios.post(
        API_URL,
        posto,
        getHeaders()
      );

      return response.data;

    } catch (error) {

      console.error(
        "Erro ao cadastrar posto:",
        error
      );

      throw error;
    }
  }

}

export default new CadastroPostoService();