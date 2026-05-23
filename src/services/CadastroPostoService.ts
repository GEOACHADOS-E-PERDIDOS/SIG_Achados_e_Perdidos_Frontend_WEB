import axios from "axios";

const API_URL = "http://localhost:8080/postos";

interface PostoDTO {
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  latitude: number;
  longitude: number;
  imagens?: File[];
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

        const formData =
          new FormData();

        formData.append(
          "nome",
          posto.nome
        );

        formData.append(
          "endereco",
          posto.endereco
        );

        formData.append(
          "telefone",
          posto.telefone
        );

        formData.append(
          "email",
          posto.email
        );

        formData.append(
          "latitude",
          String(posto.latitude)
        );

        formData.append(
          "longitude",
          String(posto.longitude)
        );

        /* ========================== */
        /* IMAGENS */
        /* ========================== */

        if (posto.imagens) {

          posto.imagens.forEach(
            (imagem) => {

              formData.append(
                "imagens",
                imagem
              );
            }
          );
        }

        const response =
          await axios.post(

            API_URL,

            formData,

            {
              headers: {

                Authorization:
                  `Bearer ${getToken()}`,

                "Content-Type":
                  "multipart/form-data"
              }
            }
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