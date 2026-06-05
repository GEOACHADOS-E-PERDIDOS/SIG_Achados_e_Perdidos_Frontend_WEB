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
  atualizarObjeto,
} from "../services/PerfilPageService";

import { buscarImagens } from "../services/ObjetoPageService";

import { listarPostosService } from "../services/PostosPageService";

import "../styles/PerfilPage.css";

type Usuario = {
  id: number;
  name: string;
  email: string;
};

type Posto = {
  id: number;
  nome: string;
};

type Categoria = {
  id: number;
  nome: string;
};

type Objeto = {
  id: number;
  nome: string;
  descricao: string;
  status: string;

  postoId?: number | null;

  imagens?: string[];
  caminhosImagens?: string[];

  imagemUrl?: string | null;

  enderecoEncontro?: string;
  dataEncontro?: string;

  latitudeEncontro?: number;
  longitudeEncontro?: number;

  categorias?: Categoria[];
};

export default function PerfilPage() {
  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [objetos, setObjetos] =
    useState<Objeto[]>([]);

  const [postos, setPostos] =
    useState<Posto[]>([]);

  const [editando, setEditando] =
    useState(false);

  const [objetoEditando, setObjetoEditando] =
    useState<Objeto | null>(null);

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
  // CARREGAR POSTOS
  // =========================

  const carregarPostos = async () => {
    try {
      const data =
        await listarPostosService();

      console.log("POSTOS:", data);

      setPostos(data);

    } catch (err) {
      console.error(
        "Erro ao carregar postos:",
        err
      );
    }
  };

  // =========================
  // MONTAR OBJETO COM IMAGEM
  // =========================

  const montarObjetoComImagens =
    async (obj: Objeto): Promise<Objeto> => {
      try {
        const caminhos: string[] =
          obj.caminhosImagens ??
          obj.imagens ??
          [];

        let imagemUrl: string | null =
          null;

        if (caminhos.length > 0) {
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
          "OBJETOS VINDOS DO BACKEND:",
          res
        );

        const objetosTratados =
          await Promise.all(
            res.map((obj: Objeto) =>
              montarObjetoComImagens(obj)
            )
          );

        console.log(
          "OBJETOS TRATADOS:",
          objetosTratados
        );

        setObjetos(objetosTratados);

      } catch (err) {
        console.error(
          "Erro ao carregar objetos:",
          err
        );
      }
    };

  // =========================
  // INIT
  // =========================

  useEffect(() => {
    carregarUsuario();
    carregarObjetos();
    carregarPostos();
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
      await atualizarMeuPerfil(form);

      await Swal.fire({
        title: "Sucesso!",
        text: "Perfil atualizado.",
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
  // EXCLUIR OBJETO
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

  // =========================
  // SALVAR OBJETO
  // =========================

  const salvarObjeto = async () => {
    if (!objetoEditando) return;

    try {
      console.log(
        "SALVANDO OBJETO:",
        objetoEditando
      );

      const isAchado =
        objetoEditando.postoId !== null &&
        objetoEditando.postoId !== undefined;

      const payload = isAchado
        ? {
            nome:
              objetoEditando.nome,

            descricao:
              objetoEditando.descricao,

            enderecoEncontro:
              objetoEditando.enderecoEncontro || "",

            dataEncontro:
              objetoEditando.dataEncontro ||
                new Date()
                    .toISOString()
                    .split("T")[0],

            postoRetiradaId:
              objetoEditando.postoId,

            latitudeAchado:
              objetoEditando.latitudeEncontro,

            longitudeAchado:
              objetoEditando.longitudeEncontro,

            categorias:
              objetoEditando.categorias?.map(
                (c) => c.id
              ) || [],
          }

        : {
            nome:
              objetoEditando.nome,

            descricao:
              objetoEditando.descricao,

            enderecoPerdido:
              objetoEditando.enderecoEncontro || "",

            dataPerdido:
              objetoEditando.dataEncontro || "",

            latitude:
              objetoEditando.latitudeEncontro,

            longitude:
              objetoEditando.longitudeEncontro,

            categorias:
              objetoEditando.categorias?.map(
                (c) => c.id
              ) || [],
          };

      console.log(
        "PAYLOAD:",
        payload
      );

      await atualizarObjeto(
        objetoEditando.id,
        payload
      );

      await Swal.fire({
        title: "Sucesso",
        text:
          "Objeto atualizado com sucesso.",
        icon: "success",
      });

      setObjetoEditando(null);

      carregarObjetos();

    } catch (err) {
      console.error(err);

      Swal.fire({
        title: "Erro",
        text:
          "Não foi possível atualizar o objeto.",
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

      <div className="perfil-main-container">

        {/* PERFIL */}

        <div className="perfil-card-container">

          <div className="perfil-card-header">
            <h2 className="perfil-titulo">
              Meu Perfil
            </h2>

            <button
              type="button"
              className="perfil-btn-pequeno"
              onClick={() =>
                setEditando(true)
              }
            >
              Editar Perfil
            </button>
          </div>

          <div className="perfil-info-content">
            <p>
              <strong>Nome:</strong>{" "}
              {usuario.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {usuario.email}
            </p>
          </div>

        </div>

        {/* OBJETOS */}

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

          <div className="objetos-grid-original">

            {objetos.map((obj) => (

                <ObjetoCardPerfil
                    key={obj.id}

                    obj={{
                    ...obj,

                    imagemUrl:
                        obj.imagemUrl,

                    enderecoEncontro:
                        obj.enderecoEncontro ||
                        "Não informado",

                    dataEncontro:
                        obj.dataEncontro || "",
                    }}

                onDelete={
                  deletarObjeto
                }

                onEditStatus={
                  alterarStatus
                }

                onEditObjeto={(
                  obj
                ) => {
                  console.log(
                    "OBJETO AO ABRIR EDIÇÃO:",
                    obj
                  );

                  setObjetoEditando({
                    ...(obj as any),

                    categorias:
                        (obj.categorias as any) || [],
                    });
                }}
              />

            ))}

          </div>

        </div>

      </div>

      {/* MODAL PERFIL */}

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

      {/* MODAL OBJETO */}

      {objetoEditando &&
        createPortal(

          <div
            className="perfil-modal-overlay"
            onClick={() =>
              setObjetoEditando(null)
            }
          >

            <div
              className="perfil-edit-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <h2>
                Editar Objeto
              </h2>

              <div className="perfil-input-group">

                <label>
                  Nome do objeto
                </label>

                <input
                  value={
                    objetoEditando.nome
                  }

                  onChange={(e) =>
                    setObjetoEditando({
                      ...objetoEditando,

                      nome:
                        e.target.value,
                    })
                  }

                  placeholder="Nome"
                />

              </div>

              <div className="perfil-input-group">

                <label>
                  Descrição
                </label>

                <textarea
                  value={
                    objetoEditando.descricao
                  }

                  onChange={(e) =>
                    setObjetoEditando({
                      ...objetoEditando,

                      descricao:
                        e.target.value,
                    })
                  }

                  placeholder="Descrição"

                  style={{
                    minHeight: "120px",
                    resize: "none",
                  }}
                />

              </div>

              {(objetoEditando.postoId !== null &&
                objetoEditando.postoId !== undefined) && (
                <div className="perfil-input-group">
                    <label>
                    Posto de retirada
                    </label>
                    <select
                    value={
                        objetoEditando.postoId
                    }
                    onChange={(e) =>
                        setObjetoEditando({
                        ...objetoEditando,
                        postoId:
                            Number(
                            e.target.value
                            ),
                        })
                    }
                    >

                    {postos
                        .filter((posto) => {
                        const ehEletronico =
                            objetoEditando.categorias?.some(
                            (c) =>
                                c.nome === "Eletrônicos"
                            );
                        if (ehEletronico) {
                            return posto.nome
                            .toLowerCase()
                            .includes("delegacia");
                        }

                        return true;
                        })
                        .map((posto) => (
                        <option
                            key={posto.id}
                            value={posto.id}
                        >
                            {posto.nome}
                        </option>
                    ))}
                    </select>
                </div>
                )}

              <div className="perfil-edit-buttons">

                <button
                  className="perfil-salvar-btn"
                  onClick={
                    salvarObjeto
                  }
                >
                  Salvar
                </button>

                <button
                  className="perfil-cancelar-btn"
                  onClick={() =>
                    setObjetoEditando(null)
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