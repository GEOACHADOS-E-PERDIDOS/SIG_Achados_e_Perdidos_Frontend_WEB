import axios from "axios";

const API_URL = "http://localhost:8080/auth";

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

class TopBarService {

  async checarAdmin(): Promise<boolean> {

    try {

      const response = await axios.get(
        `${API_URL}/admin/check`,
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

  logout() {
    localStorage.removeItem("token");
  }

}

export default new TopBarService();