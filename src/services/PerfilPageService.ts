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

  const res = await axios.put(
    `${API_OBJETOS}/${id}/status`,
    { status },
    authHeader()
  );

  return res.data;
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