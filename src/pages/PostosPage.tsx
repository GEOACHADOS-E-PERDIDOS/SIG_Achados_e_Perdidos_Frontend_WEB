import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

import Topbar from "../components/Topbar";
import PostoCard from "../components/PostoCard";
import PostoDetalhe from "../components/PostoDetalhes";
import "../styles/Postos.css";

import {
  listarPostosService,
  buscarPostosService,
  deletarPostoService,
  atualizarPostoService,
} from "../services/PostosPageService";

type Posto = {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  latitude?: number;
  longitude?: number;
  imagens?: string[];
};

function PostosPage() {
  const { t } = useTranslation();

  const [postos, setPostos] = useState<Posto[]>([]);
  const [termo, setTermo] = useState("");

  const [postoSelecionado, setPostoSelecionado] =
    useState<Posto | null>(null);

  const [postoEditando, setPostoEditando] =
    useState<Posto | null>(null);

  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    email: "",
    latitude: 0,
    longitude: 0,
  });

  // CARREGAR POSTOS
  const carregarPostos = async () => {
    try {
      const data = await listarPostosService();
      setPostos(data);
    } catch (err) {
      console.error("Erro ao listar postos:", err);
    }
  };

  // BUSCAR POSTOS
  const buscar = async () => {
    try {
      const data = await buscarPostosService(termo);
      setPostos(data);
    } catch (err) {
      console.error("Erro ao buscar postos:", err);
    }
  };

  // LIMPAR BUSCA
  const limpar = () => {
    setTermo("");
    carregarPostos();
  };

  // EXCLUIR POSTO
  const deletar = async (id: number) => {
    try {
      await deletarPostoService(id);

      setPostos((prev) =>
        prev.filter((p) => p.id !== id)
      );

      await Swal.fire({
        title: t("postos.excluido"),
        text: t("postos.postoRemovido"),
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      console.error(err);

      await Swal.fire({
        title: t("postos.erro"),
        text: t("postos.excluirErro"),
        icon: "error",
      });
    }
  };

  // ABRIR EDIÇÃO
  const abrirEdicao = (posto: Posto) => {
    setPostoEditando(posto);

    setForm({
      nome: posto.nome,
      endereco: posto.endereco,
      telefone: posto.telefone,
      email: posto.email,
      latitude: posto.latitude ?? 0,
      longitude: posto.longitude ?? 0,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SALVAR EDIÇÃO
  const salvarEdicao = async () => {
    if (!postoEditando) return;

    try {
      const payload = {
        nome: form.nome,
        endereco: form.endereco,
        telefone: form.telefone,
        email: form.email,
        latitude: form.latitude,
        longitude: form.longitude,
      };

      await atualizarPostoService(
        postoEditando.id,
        payload
      );

      await Swal.fire({
        title: t("postos.atualizado"),
        text: t("postos.postoAtualizado"),
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      setPostoEditando(null);
      carregarPostos();
    } catch (err) {
      console.error(err);

      await Swal.fire({
        title: t("postos.erro"),
        text: t("postos.atualizarErro"),
        icon: "error",
      });
    }
  };

  // INICIALIZAÇÃO
  useEffect(() => {
    carregarPostos();
  }, []);

  return (
    <div className="home-page">
      <Topbar />

      <h2 className="titulo">
        {t("postos.titulo")}
      </h2>

      {/* FILTRO */}
      <div className="filtro-container">
        <input
          autoComplete="off"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              buscar();
            }
          }}
          placeholder={t("postos.buscarNomeEndereco")}
        />

        <button onClick={buscar}>
          {t("postos.buscar")}
        </button>

        <button onClick={limpar}>
          {t("postos.limpar")}
        </button>
      </div>

      {/* LISTA DE POSTOS */}
      <div className="lista-postos">
        {postos.map((posto) => (
          <PostoCard
            key={posto.id}
            posto={posto}
            onClick={() => setPostoSelecionado(posto)}
            onDelete={() => deletar(posto.id)}
            onEdit={() => abrirEdicao(posto)}
          />
        ))}
      </div>

      {/* DETALHES DO POSTO */}
      {postoSelecionado &&
        createPortal(
          <div
            className="modal-overlay"
            onClick={() => setPostoSelecionado(null)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="btn-fechar-modal"
                aria-label={t("postos.fecharDetalhes")}
                onClick={() => setPostoSelecionado(null)}
              >
                ✕
              </button>

              <PostoDetalhe
                posto={postoSelecionado}
                onClose={() => setPostoSelecionado(null)}
              />
            </div>
          </div>,
          document.body
        )}

      {/* MODAL DE EDIÇÃO */}
      {postoEditando &&
        createPortal(
          <div
            className="modal-overlay"
            onClick={() => setPostoEditando(null)}
          >
            <div
              className="modal-editar-posto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modal-title">
                {t("postos.editarPosto")}
              </h2>

              <div className="form-editar-posto">
                <div className="input-group">
                  <label>{t("postos.nome")}</label>

                  <input
                    autoComplete="off"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder={t("postos.nomePosto")}
                  />
                </div>

                <div className="input-group">
                  <label>{t("postos.endereco")}</label>

                  <input
                    autoComplete="off"
                    name="endereco"
                    value={form.endereco}
                    onChange={handleChange}
                    placeholder={t("postos.endereco")}
                  />
                </div>

                <div className="input-group">
                  <label>{t("postos.telefone")}</label>

                  <input
                    autoComplete="off"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder={t("postos.telefone")}
                  />
                </div>

                <div className="input-group">
                  <label>{t("postos.email")}</label>

                  <input
                    autoComplete="off"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t("postos.email")}
                  />
                </div>

                <div className="modal-buttons">
                  <button
                    className="btn-salvar-posto"
                    onClick={salvarEdicao}
                  >
                    {t("postos.salvar")}
                  </button>

                  <button
                    className="btn-cancelar-posto"
                    onClick={() => setPostoEditando(null)}
                  >
                    {t("postos.cancelar")}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default PostosPage;