import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

import Topbar from "../components/Topbar";
import ObjetoCardPerfil from "../components/ObjetoCardPerfil";

import {
  buscarMeuPerfil,
  atualizarMeuPerfil,
  buscarMeusObjetos,
  buscarObjetosDoPosto,
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
  isPosto: boolean;
  postoId?: number | null;
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
  const { t } = useTranslation();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [postos, setPostos] = useState<Posto[]>([]);
  const [editando, setEditando] = useState(false);
  const [objetoEditando, setObjetoEditando] =
    useState<Objeto | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // CARREGAR PERFIL
  const carregarUsuario = async () => {
    try {
      const res = await buscarMeuPerfil();

      setUsuario(res);
      await carregarObjetos(res);

      setForm({
        name: res.name || "",
        email: res.email || "",
      });
    } catch (err) {
      console.error(err);

      await Swal.fire({
        title: t("perfil.erro"),
        text: t("perfil.perfilCarregadoErro"),
        icon: "error",
      });
    }
  };

  // CARREGAR POSTOS
  const carregarPostos = async () => {
    try {
      const data = await listarPostosService();
      setPostos(data);
    } catch (err) {
      console.error("Erro ao carregar postos:", err);
    }
  };

  // MONTAR OBJETO COM IMAGEM
  const montarObjetoComImagens = async (
    obj: Objeto
  ): Promise<Objeto> => {
    try {
      const caminhos: string[] =
        obj.caminhosImagens ?? obj.imagens ?? [];

      let imagemUrl: string | null = null;

      if (caminhos.length > 0) {
        const imagens = await buscarImagens(caminhos);
        imagemUrl = imagens?.[0] ?? null;
      }

      return {
        ...obj,
        imagemUrl,
      };
    } catch (err) {
      console.error("Erro ao carregar imagem:", err);

      return {
        ...obj,
        imagemUrl: null,
      };
    }
  };

  // CARREGAR OBJETOS
  const carregarObjetos = async (perfil?: Usuario) => {
    try {
      let res;

      if (perfil?.isPosto && perfil?.postoId) {
        res = await buscarObjetosDoPosto(perfil.postoId);
      } else {
        res = await buscarMeusObjetos();
      }

      const objetosTratados = await Promise.all(
        res.map((obj: Objeto) =>
          montarObjetoComImagens(obj)
        )
      );

      setObjetos(objetosTratados);
    } catch (err) {
      console.error("Erro ao carregar objetos:", err);
    }
  };

  // INICIALIZAÇÃO
  useEffect(() => {
    carregarUsuario();
    carregarPostos();
  }, []);

  // FORMULÁRIO DE PERFIL
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SALVAR PERFIL
  const salvar = async () => {
    try {
      await atualizarMeuPerfil(form);

      await Swal.fire({
        title: t("perfil.sucesso"),
        text: t("perfil.perfilAtualizado"),
        icon: "success",
      });

      setEditando(false);
      carregarUsuario();
    } catch (err) {
      await Swal.fire({
        title: t("perfil.erro"),
        text: t("perfil.perfilAtualizarErro"),
        icon: "error",
      });
    }
  };

  // ALTERAR STATUS
  const alterarStatus = async (
    id: number,
    statusAtual: string
  ) => {
    const { value: novoStatus } = await Swal.fire({
      title: t("perfil.alterarStatus"),
      input: "select",
      inputOptions: {
        DISPONIVEL: t("perfil.disponivel"),
        DEVOLVIDO: t("perfil.devolvido"),
        PERDIDO: t("perfil.perdido"),
        DESCARTADO: t("perfil.descartado"),
      },
      inputValue: statusAtual,
      showCancelButton: true,
      confirmButtonText: t("perfil.salvar"),
      cancelButtonText: t("perfil.cancelar"),
    });

    if (!novoStatus) return;

    try {
      await atualizarStatusObjeto(id, novoStatus);

      await Swal.fire({
        title: t("perfil.sucesso"),
        text: t("perfil.statusAtualizado"),
        icon: "success",
      });

      carregarObjetos();
    } catch (err) {
      await Swal.fire({
        title: t("perfil.erro"),
        text: t("perfil.statusAtualizarErro"),
        icon: "error",
      });
    }
  };

  // EXCLUIR OBJETO
  const deletarObjeto = async (id: number) => {
    const confirmacao = await Swal.fire({
      title: t("perfil.excluirObjeto"),
      text: t("perfil.excluirAviso"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("perfil.excluido"),
      cancelButtonText: t("perfil.cancelar"),
    });

    if (!confirmacao.isConfirmed) return;

    try {
      await excluirObjeto(id);

      await Swal.fire({
        title: t("perfil.excluido"),
        icon: "success",
      });

      carregarObjetos();
    } catch (err) {
      await Swal.fire({
        title: t("perfil.erro"),
        text: t("perfil.excluirErro"),
        icon: "error",
      });
    }
  };

  // SALVAR OBJETO EDITADO
  const salvarObjeto = async () => {
    if (!objetoEditando) return;

    try {
      const isAchado =
        objetoEditando.postoId !== null &&
        objetoEditando.postoId !== undefined;

      const payload = isAchado
        ? {
            nome: objetoEditando.nome,
            descricao: objetoEditando.descricao,
            enderecoEncontro:
              objetoEditando.enderecoEncontro || "",
            dataEncontro:
              objetoEditando.dataEncontro ||
              new Date().toISOString().split("T")[0],
            postoRetiradaId: objetoEditando.postoId,
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
            nome: objetoEditando.nome,
            descricao: objetoEditando.descricao,
            enderecoPerdido:
              objetoEditando.enderecoEncontro || "",
            dataPerdido:
              objetoEditando.dataEncontro || "",
            latitude: objetoEditando.latitudeEncontro,
            longitude: objetoEditando.longitudeEncontro,
            categorias:
              objetoEditando.categorias?.map(
                (c) => c.id
              ) || [],
          };

      await atualizarObjeto(objetoEditando.id, payload);

      await Swal.fire({
        title: t("perfil.sucesso"),
        text: t("perfil.objetoAtualizado"),
        icon: "success",
      });

      setObjetoEditando(null);
      carregarObjetos();
    } catch (err) {
      console.error(err);

      await Swal.fire({
        title: t("perfil.erro"),
        text: t("perfil.objetoAtualizarErro"),
        icon: "error",
      });
    }
  };

  if (!usuario) {
    return <p>{t("perfil.carregando")}</p>;
  }

  return (
    <div className="home-page">
      <Topbar />

      {/* PERFIL */}
      <div className="perfil-main-container">
        <div className="perfil-card-container">
          <div className="perfil-card-header">
            <h2 className="perfil-titulo">
              {t("perfil.perfilTitulo")}
            </h2>

            <button
              type="button"
              className="perfil-btn-pequeno"
              onClick={() => setEditando(true)}
            >
              {t("perfil.editarPerfil")}
            </button>
          </div>

          <div className="perfil-info-content">
            <p>
              <strong>{t("perfil.nome")}:</strong>{" "}
              {usuario.name}
            </p>

            <p>
              <strong>{t("perfil.email")}:</strong>{" "}
              {usuario.email}
            </p>
          </div>
        </div>

        {/* OBJETOS */}
        <div
          className="objetos-section"
          style={{ width: "100%" }}
        >
          <h2 style={{ marginBottom: "25px" }}>
            {t("perfil.meusObjetos")}
          </h2>

          <div className="objetos-grid-original">
            {objetos.map((obj) => (
              <ObjetoCardPerfil
                key={obj.id}
                obj={{
                  ...obj,
                  imagemUrl: obj.imagemUrl,
                  enderecoEncontro:
                    obj.enderecoEncontro ||
                    t("perfil.naoInformado"),
                  dataEncontro: obj.dataEncontro || "",
                }}
                isPosto={usuario.isPosto}
                onDelete={deletarObjeto}
                onEditStatus={alterarStatus}
                onEditObjeto={(obj) => {
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

      {/* MODAL EDITAR PERFIL */}
      {editando &&
        createPortal(
          <div
            className="perfil-modal-overlay"
            onClick={() => setEditando(false)}
          >
            <div
              className="perfil-edit-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{t("perfil.editarPerfil")}</h2>

              <input
                autoComplete="off"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("perfil.nome")}
              />

              <input
                autoComplete="off"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("perfil.email")}
              />

              <div className="perfil-edit-buttons">
                <button
                  className="perfil-salvar-btn"
                  onClick={salvar}
                >
                  {t("perfil.salvar")}
                </button>

                <button
                  className="perfil-cancelar-btn"
                  onClick={() => setEditando(false)}
                >
                  {t("perfil.cancelar")}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL EDITAR OBJETO */}
      {objetoEditando &&
        createPortal(
          <div
            className="perfil-modal-overlay"
            onClick={() => setObjetoEditando(null)}
          >
            <div
              className="perfil-edit-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{t("perfil.editarObjeto")}</h2>

              <div className="perfil-input-group">
                <label>{t("perfil.nomeObjeto")}</label>

                <input
                  autoComplete="off"
                  value={objetoEditando.nome}
                  onChange={(e) =>
                    setObjetoEditando({
                      ...objetoEditando,
                      nome: e.target.value,
                    })
                  }
                  placeholder={t("perfil.nome")}
                />
              </div>

              <div className="perfil-input-group">
                <label>{t("perfil.descricao")}</label>

                <textarea
                  value={objetoEditando.descricao}
                  onChange={(e) =>
                    setObjetoEditando({
                      ...objetoEditando,
                      descricao: e.target.value,
                    })
                  }
                  placeholder={t("perfil.descricao")}
                  style={{
                    minHeight: "120px",
                    resize: "none",
                  }}
                />
              </div>

              {objetoEditando.postoId !== null &&
                objetoEditando.postoId !== undefined && (
                  <div className="perfil-input-group">
                    <label>
                      {t("perfil.postoRetirada")}
                    </label>

                    <select
                      value={objetoEditando.postoId}
                      onChange={(e) =>
                        setObjetoEditando({
                          ...objetoEditando,
                          postoId: Number(e.target.value),
                        })
                      }
                    >
                      {postos
                        .filter((posto) => {
                          const ehEletronico =
                            objetoEditando.categorias?.some(
                              (c) => c.nome === "Eletrônicos"
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
                  onClick={salvarObjeto}
                >
                  {t("perfil.salvar")}
                </button>

                <button
                  className="perfil-cancelar-btn"
                  onClick={() => setObjetoEditando(null)}
                >
                  {t("perfil.cancelar")}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}