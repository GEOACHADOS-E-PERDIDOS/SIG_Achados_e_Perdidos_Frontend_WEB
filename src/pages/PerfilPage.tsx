import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";

import Topbar from "../components/Topbar";
import ObjetoCardPerfil from "../components/ObjetoCardPerfil";

import {
  buscarMeuPerfil,
  atualizarMeuPerfil,
  buscarMeusObjetos,
  atualizarStatusObjeto,
  excluirObjeto,
} from "../services/PerfilPageService";

import { buscarImagens } from "../services/ObjetoPageService";

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

  imagens?: string[];

  caminhosImagens?: string[];

  imagemUrl?: string | null;

  enderecoEncontro?: string;

  dataEncontro?: string;
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
  // MONTAR OBJETO COM IMAGEM
  // =========================

  const montarObjetoComImagens =
    async (obj: any) => {

      try {

        // exatamente igual ao Objetos.tsx
        const caminhos: string[] =
          obj.caminhosImagens
          ?? obj.imagens
          ?? [];

        let imagemUrl: string | null =
          null;

        if (
          caminhos.length > 0
        ) {

          const imagens =
            await buscarImagens(
              caminhos
            );

          imagemUrl =
            imagens?.[0] ?? null;
        }

        return {
          ...obj,
          imagemUrl,
        };

      } catch (err) {

        console.error(
          "Erro ao carregar imagem:",
          err
        );

        return {
          ...obj,
          imagemUrl: null,
        };
      }
    };

  // =========================
  // CARREGAR OBJETOS
  // =========================

  const carregarObjetos =
    async () => {

      try {

        const res =
          await buscarMeusObjetos();

        console.log(
          "OBJETOS RECEBIDOS:",
          res
        );

        const objetosTratados =
          await Promise.all(

            res.map(
              (obj: any) =>
                montarObjetoComImagens(
                  obj
                )
            )
          );

        console.log(
          "OBJETOS TRATADOS:",
          objetosTratados
        );

        setObjetos(
          objetosTratados
        );

      } catch (err) {

        console.error(
          "Erro ao carregar objetos:",
          err
        );
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
      [e.target.name]:
        e.target.value,
    });
  };

  // =========================
  // SALVAR PERFIL
  // =========================

  const salvar = async () => {

    try {

      await atualizarMeuPerfil(
        form
      );

      await Swal.fire({
        title: "Sucesso!",
        text:
          "Perfil atualizado.",
        icon: "success",
      });

      setEditando(false);

      carregarUsuario();

    } catch (err) {

      Swal.fire({
        title: "Erro",
        text:
          "Não foi possível atualizar.",
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

        title:
          "Alterar status",

        input: "select",

        inputOptions: {
          DISPONIVEL:
            "DISPONIVEL",

          DEVOLVIDO:
            "DEVOLVIDO",

          PERDIDO:
            "PERDIDO",

          DESCARTADO:
            "DESCARTADO",
        },

        inputValue:
          statusAtual,

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
        text:
          "Status atualizado.",
        icon: "success",
      });

      carregarObjetos();

    } catch (err) {

      Swal.fire({
        title: "Erro",
        text:
          "Não foi possível atualizar.",
        icon: "error",
      });
    }
  };

  // =========================
  // EXCLUIR
  // =========================

  const deletarObjeto = async (
    id: number
  ) => {

    const confirmacao =
      await Swal.fire({

        title:
          "Excluir objeto?",

        text:
          "Essa ação não poderá ser desfeita.",

        icon: "warning",

        showCancelButton: true,
      });

    if (
      !confirmacao.isConfirmed
    ) return;

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
        text:
          "Não foi possível excluir.",
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

    <div
      style={{
        width: "100%",
        padding: "20px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >

      {/* ========================= */}
      {/* PERFIL */}
      {/* ========================= */}

      <div
        className="perfil-card"
        style={{
          width: "350px",
          marginBottom: "40px",
        }}
      >

        <h2>Meu Perfil</h2>

        <div className="perfil-info">

          <p>
            <strong>Nome:</strong>{" "}
            {usuario.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {usuario.email}
          </p>

        </div>

        <button
          className="perfil-btn"
          onClick={() =>
            setEditando(true)
          }
        >
          Editar Perfil
        </button>

      </div>

      {/* ========================= */}
      {/* OBJETOS */}
      {/* ========================= */}

      <div
        className="objetos-section"
        style={{
          width: "100%",
        }}
      >

        <h2
          style={{
            marginBottom: "25px",
          }}
        >
          Meus Objetos
        </h2>

       <div
        className="objetos-grid"
        style={{

            display: "grid",

            gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",

            gap: "24px",

            flexDirection: "column",


            width: "100%",
        }}
        >

          {objetos.map((obj) => (

            <ObjetoCardPerfil
              key={obj.id}

              obj={{

                ...obj,

                imagemUrl:
                  obj.imagemUrl,

                enderecoEncontro:
                  obj.enderecoEncontro
                  || "Não informado",

                dataEncontro:
                  obj.dataEncontro
                  || "",
              }}

              onDelete={
                deletarObjeto
              }

              onEditStatus={
                alterarStatus
              }
            />

          ))}

        </div>

      </div>

    </div>

    {/* ========================= */}
    {/* MODAL */}
    {/* ========================= */}

    {editando &&
      createPortal(

        <div
          className="perfil-modal-overlay"

          onClick={() =>
            setEditando(false)
          }
        >

          <div
            className="perfil-edit-modal"

            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2>
              Editar Perfil
            </h2>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              placeholder="Nome"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={
                handleChange
              }
              placeholder="Email"
            />

            <div className="perfil-edit-buttons">

              <button
                className="perfil-salvar-btn"
                onClick={salvar}
              >
                Salvar
              </button>

              <button
                className="perfil-cancelar-btn"

                onClick={() =>
                  setEditando(false)
                }
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