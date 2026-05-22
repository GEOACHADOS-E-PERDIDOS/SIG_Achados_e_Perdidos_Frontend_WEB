import axios from "axios";

const API_URL =
    "http://localhost:8080/auth";

export const alterarSenha =
    async (
        novaSenha: string
    ) => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {
            throw new Error(
                "Usuário não autenticado"
            );
        }

        const response =
            await axios.post(
                `${API_URL}/trocar-senha`,
                {
                    novaSenha
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        return response.data;
    };