
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Topbar from "../components/Topbar";
import deleteIcon from "../assets/delete.svg";
import "../styles/Objetos.css";
import UsuarioCard from "../components/UsuarioCard";

import UsuarioPageService from "../services/UsuarioPageService";
import Swal from "sweetalert2";

interface Usuario {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  dataCadastro: string;
}

function UsuariosPage() {
  const { t } = useTranslation();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const listarUsuarios = async () => {
    try {
      const data = await UsuarioPageService.listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletarUsuario = async (id: number) => {
    const resultado = await Swal.fire({
      title: t("usuarios.confirmarExclusao"),
      text: t("usuarios.confirmarExclusaoTexto"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("usuarios.simDeletar"),
      cancelButtonText: t("usuarios.cancelar"),
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    });

    if (!resultado.isConfirmed) return;

    try {
      await UsuarioPageService.deletarUsuario(id);

      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.filter((u) => u.id !== id)
      );

      await Swal.fire({
        title: t("usuarios.usuarioRemovido"),
        text: t("usuarios.usuarioDeletadoSucesso"),
        icon: "success",
        confirmButtonText: t("usuarios.ok"),
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error(error);

      await Swal.fire({
        title: t("usuarios.erro"),
        text: t("usuarios.erroDeletar"),
        icon: "error",
        confirmButtonText: t("usuarios.fechar"),
        confirmButtonColor: "#d33",
      });
    }
  };

  useEffect(() => {
    listarUsuarios();
  }, []);

  return (
    <div className="home-page">
      <Topbar />

      <div className="lista-objetos">
        {usuarios.map((user) => (
          <div key={user.id} style={{ position: "relative" }}>
            <UsuarioCard
              onActionSuccess={listarUsuarios}
              usuario={{
                id: user.id,
                nome: user.name,
                email: user.email,
                role: user.isAdmin ? "ADMIN" : "USER",
                dataCadastro: user.dataCadastro,
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                cursor: "pointer",
                padding: "5px",
                zIndex: 2,
              }}
              title={t("usuarios.deletarUsuario")}
              onClick={() => deletarUsuario(user.id)}
            >
              <img
                src={deleteIcon}
                alt={t("usuarios.deletar")}
                style={{ width: "24px" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsuariosPage;
