
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/UsuarioCard.css";
import {
  tornarAdmin,
  resetarSenha,
  tornarPosto
} from "../services/UsuarioCardService";
import Swal from "sweetalert2";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: string;
  dataCadastro?: string;
};

type Props = {
  usuario: Usuario;
  onActionSuccess: () => void;
};

export default function UsuarioCard({
  usuario,
  onActionSuccess
}: Props) {
  const { t, i18n } = useTranslation();
  const [popupAberto, setPopupAberto] = useState(false);

  const idiomaData = i18n.language.startsWith("en")
    ? "en-US"
    : "pt-BR";

  const handleTornarAdmin = async () => {
    const resultado = await Swal.fire({
      title: t("usuarioCard.confirmarAcao"),
      text: t("usuarioCard.confirmarAdmin", {
        nome: usuario.nome
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("usuarioCard.simTornarAdmin"),
      cancelButtonText: t("usuarioCard.cancelar"),
    });

    if (resultado.isConfirmed) {
      try {
        await tornarAdmin(usuario.id);

        await Swal.fire({
          title: t("usuarioCard.sucesso"),
          text: t("usuarioCard.usuarioPromovidoAdmin"),
          icon: "success",
          confirmButtonText: t("usuarioCard.ok"),
          confirmButtonColor: "#3085d6",
        });

        setPopupAberto(false);
        onActionSuccess();

      } catch (error) {
        console.error(error);

        Swal.fire({
          title: t("usuarioCard.erro"),
          text: t("usuarioCard.erroPromoverUsuario"),
          icon: "error",
          confirmButtonText: t("usuarioCard.fechar"),
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const handleTornarPosto = async () => {
    const resultado = await Swal.fire({
      title: t("usuarioCard.confirmarAcao"),
      text: t("usuarioCard.confirmarPosto", {
        nome: usuario.nome
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("usuarioCard.simTornarPosto"),
      cancelButtonText: t("usuarioCard.cancelar"),
    });

    if (resultado.isConfirmed) {
      try {
        await tornarPosto(usuario.id);

        await Swal.fire({
          title: t("usuarioCard.sucesso"),
          text: t("usuarioCard.usuarioPromovidoPosto"),
          icon: "success",
          confirmButtonText: t("usuarioCard.ok"),
          confirmButtonColor: "#3085d6",
        });

        setPopupAberto(false);
        onActionSuccess();

      } catch (error) {
        console.error(error);

        Swal.fire({
          title: t("usuarioCard.erro"),
          text: t("usuarioCard.erroPromoverPosto"),
          icon: "error",
          confirmButtonText: t("usuarioCard.fechar"),
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const handleResetarSenha = async () => {
    const resultado = await Swal.fire({
      title: t("usuarioCard.resetarSenha"),
      text: t("usuarioCard.confirmarResetarSenha", {
        nome: usuario.nome
      }),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("usuarioCard.simResetar"),
      cancelButtonText: t("usuarioCard.cancelar"),
    });

    if (resultado.isConfirmed) {
      try {
        const resposta = await resetarSenha(usuario.id);

        await Swal.fire({
          title: t("usuarioCard.sucessoComExclamacao"),
          text: resposta || t("usuarioCard.linkRecuperacaoEnviado"),
          icon: "success",
          confirmButtonText: t("usuarioCard.ok"),
          confirmButtonColor: "#3085d6",
        });

        setPopupAberto(false);

      } catch (error) {
        console.error(error);

        Swal.fire({
          title: t("usuarioCard.erro"),
          text: t("usuarioCard.erroResetarSenha"),
          icon: "error",
          confirmButtonText: t("usuarioCard.fechar"),
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <>
      <div
        className="usuario-card"
        onClick={() => setPopupAberto(true)}
      >
        <div className="card-text">
          <h3>{usuario.nome}</h3>

          <p>
            <strong>{t("usuarioCard.email")}:</strong> {usuario.email}
          </p>

          <p>
            <strong>{t("usuarioCard.admin")}:</strong>{" "}
            {usuario.role === "ADMIN"
              ? t("usuarioCard.sim")
              : t("usuarioCard.nao")}
          </p>

          {usuario.dataCadastro && (
            <p>
              <strong>{t("usuarioCard.cadastro")}:</strong>{" "}
              {new Date(usuario.dataCadastro).toLocaleDateString(
                idiomaData
              )}
            </p>
          )}
        </div>
      </div>

      {popupAberto && (
        <div className="popup-overlay">
          <div className="popup-box usuario-popup">
            <h2>{t("usuarioCard.usuario")}</h2>

            <p>
              <strong>{t("usuarioCard.nome")}:</strong> {usuario.nome}
            </p>

            <p>
              <strong>{t("usuarioCard.email")}:</strong> {usuario.email}
            </p>

            <p>
              <strong>{t("usuarioCard.role")}:</strong> {usuario.role}
            </p>

            {usuario.role !== "ADMIN" && (
              <button
                className="admin-btn"
                onClick={handleTornarAdmin}
              >
                {t("usuarioCard.tornarAdmin")}
              </button>
            )}

            <button
              className="admin-btn"
              onClick={handleTornarPosto}
            >
              {t("usuarioCard.tornarPosto")}
            </button>

            <button
              className="admin-btn"
              onClick={handleResetarSenha}
            >
              {t("usuarioCard.resetarSenha")}
            </button>

            <button
              className="fechar-btn"
              onClick={() => setPopupAberto(false)}
            >
              {t("usuarioCard.fechar")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
