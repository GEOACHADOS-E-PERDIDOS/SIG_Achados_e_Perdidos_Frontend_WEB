import axios from "axios";

const API_URL = "http://localhost:8080/usuario";

const getAuthHeader = () => {

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Tornar admin
export async function tornarAdmin(
  id: number
): Promise<void> {

  await axios.put(
    `${API_URL}/${id}/tornar-admin`,
    {},
    getAuthHeader()
  );
}

// Resetar senha
export async function resetarSenha(
  id: number
): Promise<string> {

  const response = await axios.put(
    `${API_URL}/${id}/resetar-senha`,
    {},
    getAuthHeader()
  );

  return response.data;
}

export async function tornarPosto(
  id: number
): Promise<void> {

  await axios.put(
    `${API_URL}/${id}/tornar-posto`,
    {},
    getAuthHeader()
  );
}