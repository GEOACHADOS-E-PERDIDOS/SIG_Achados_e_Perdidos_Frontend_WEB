import axios from "axios";

const API_URL = "http://localhost:8080/auth";

class RecuperarSenhaPageService {

  async recuperarSenha(email: string) {
    try {

      const response = await axios.post(
        `${API_URL}/recuperar-senha`,
        null,
        {
          params: {
            email
          }
        }
      );

      return response.data;

    } catch (error) {

      console.error(
        "Erro ao recuperar senha:",
        error
      );

      throw error;
    }
  }

}

export default new RecuperarSenhaPageService();