import axios from "axios";

const API_USUARIO = "http://localhost:8080/usuario";
const API_OBJETOS = "http://localhost:8080/objetos";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// =========================
// PERFIL
// =========================

export const buscarMeuPerfil = async () => {

  const res = await axios.get(
    `${API_USUARIO}/me`,
    authHeader()
  );

  return res.data;
};

export const atualizarMeuPerfil = async (
  data: any
) => {

  const res = await axios.put(
    `${API_USUARIO}/me`,
    data,
    authHeader()
  );

  return res.data;
};

// =========================
// MEUS OBJETOS
// =========================

export const buscarMeusObjetos = async () => {

  const res = await axios.get(
    `${API_OBJETOS}/me`,
    authHeader()
  );

  return res.data;
};

// =========================
// ALTERAR STATUS
// =========================

export const atualizarStatusObjeto = async (
  id: number,
  status: string
) => {

  try {

    const res = await axios.put(
      `${API_OBJETOS}/${id}/status`,
      { status },
      authHeader()
    );

    return res.data;

  } catch (err: any) {

    console.log(
      "🔥 ERRO BACKEND:",
      err.response?.data
    );

    console.log(
      "🔥 STATUS HTTP:",
      err.response?.status
    );

    throw err;
  }
};

// =========================
// EXCLUIR OBJETO
// =========================

export const excluirObjeto = async (
  id: number
) => {

  const res = await axios.delete(
    `${API_OBJETOS}/${id}`,
    authHeader()
  );

  return res.data;
};

export const atualizarObjeto = async (
  id: number,
  data: any
) => {

  console.log("STATUS ENVIADO:");
    console.log("id =", id);
    console.log("status =", status);

  const isAchado =
    data.postoRetiradaId !== undefined;

  const rota = isAchado
    ? `${API_OBJETOS}/achados/${id}`
    : `${API_OBJETOS}/perdidos/${id}`;

  const res = await axios.put(
    rota,
    data,
    authHeader()
  );

  return res.data;
};

export const buscarObjetosDoPosto = async (
  postoId: number
) => {

  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:8080/objetos/achados/buscar/posto/${postoId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar objetos do posto");
  }

  return response.json();
};