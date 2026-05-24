import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";

import Topbar from "../components/Topbar";

import {
  buscarMeuPerfil,
  atualizarMeuPerfil,
  buscarMeusObjetos,
  atualizarStatusObjeto,
  excluirObjeto,
} from "../services/PerfilPageService";

import "../styles/PerfilPage.css";

type Usuario = {
  id: number;
  name: string;
  email: string;
};

type Objeto = {
  id: number;
  nome: string;
  descricao: string;
  status: string;
  imagens: string[];
};

export default function PerfilPage() {

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [objetos, setObjetos] =
    useState<Objeto[]>([]);

  const [editando, setEditando] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // =========================
  // CARREGAR PERFIL
  // =========================
  const carregarUsuario = async () => {

    try {

      const res =
        await buscarMeuPerfil();

      setUsuario(res);

      setForm({
        name: res.name || "",
        email: res.email || "",
      });

    } catch (err) {

      console.error(err);

      Swal.fire({
        title: "Erro",
        text: "Não foi possível carregar o perfil.",
        icon: "error",
      });

    }
  };

  // =========================
  // CARREGAR OBJETOS
  // =========================
  const carregarObjetos = async () => {

    try {

      const res =
        await buscarMeusObjetos();

      setObjetos(res);

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {

    carregarUsuario();

    carregarObjetos();

  }, []);

  // =========================
  // FORM
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  // =========================
  // SALVAR PERFIL
  // =========================
  const salvar = async () => {

    try {

      await atualizarMeuPerfil(form);

      await Swal.fire({
        title: "Sucesso!",
        text: "Perfil atualizado com sucesso.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      setEditando(false);

      carregarUsuario();

    } catch (err) {

      console.error(err);

      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar o perfil.",
        icon: "error",
      });

    }
  };

  // =========================
  // ALTERAR STATUS
  // =========================
  const alterarStatus = async (
    id: number,
    statusAtual: string
  ) => {

    const { value: novoStatus } =
      await Swal.fire({

        title: "Alterar status",

        input: "select",

        inputOptions: {
          DISPONIVEL: "DISPONIVEL",
          ENTREGUE: "ENTREGUE",
          PERDIDO: "PERDIDO",
        },

        inputValue: statusAtual,

        showCancelButton: true,
      });

    if (!novoStatus) return;

    try {

      await atualizarStatusObjeto(
        id,
        novoStatus
      );

      Swal.fire({
        title: "Sucesso",
        text: "Status atualizado.",
        icon: "success",
      });

      carregarObjetos();

    } catch (err) {

      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar.",
        icon: "error",
      });

    }
  };

  // =========================
  // EXCLUIR OBJETO
  // =========================
  const deletarObjeto = async (
    id: number
  ) => {

    const confirmacao =
      await Swal.fire({

        title: "Excluir objeto?",

        text: "Essa ação não poderá ser desfeita.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Excluir",
      });

    if (!confirmacao.isConfirmed) return;

    try {

      await excluirObjeto(id);

      Swal.fire({
        title: "Excluído",
        icon: "success",
      });

      carregarObjetos();

    } catch (err) {

      Swal.fire({
        title: "Erro",
        text: "Não foi possível excluir.",
        icon: "error",
      });

    }
  };

  if (!usuario) {
    return <p>Carregando...</p>;
  }

  return (

    <div className="home-page">

      <Topbar />

      <div className="perfil-container">

        <div className="perfil-card">

          <h2>Meu Perfil</h2>

          <div className="perfil-info">

            <p>
              <strong>Nome:</strong>
              {usuario.name}
            </p>

            <p>
              <strong>Email:</strong>
              {usuario.email}
            </p>

          </div>

          <button
            className="perfil-btn"
            onClick={() => setEditando(true)}
          >
            Editar Perfil
          </button>

        </div>

      </div>

      {/* ========================= */}
      {/* MEUS OBJETOS */}
      {/* ========================= */}

      <div className="perfil-container">

        <div className="perfil-card">

          <h2>Meus Objetos</h2>

          <div className="objetos-grid">

            {objetos.map((obj) => (

              <div
                className="objeto-card"
                key={obj.id}
              >

                {obj.imagens?.length > 0 && (

                  <img
                    src={`http://localhost:8080/uploads/${obj.imagens[0]}`}
                    alt={obj.nome}
                    className="objeto-imagem"
                  />

                )}

                <h3>{obj.nome}</h3>

                <p>{obj.descricao}</p>

                <span className="status-badge">
                  {obj.status}
                </span>

                <div className="acoes-objeto">

                  <button
                    onClick={() =>
                      alterarStatus(
                        obj.id,
                        obj.status
                      )
                    }
                  >
                    ⚙️ Status
                  </button>

                  <button
                    onClick={() =>
                      deletarObjeto(obj.id)
                    }
                  >
                    🗑 Excluir
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* MODAL */}
      {editando &&
        createPortal(

          <div
            className="modal-overlay"
            onClick={() => setEditando(false)}
          >

            <div
              className="perfil-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <h2>Editar Perfil</h2>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nome"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />

              <div className="perfil-modal-buttons">

                <button
                  className="salvar-btn"
                  onClick={salvar}
                >
                  Salvar
                </button>

                <button
                  className="cancelar-btn"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>

              </div>

            </div>

          </div>,

          document.body
        )}

    </div>
  );
}