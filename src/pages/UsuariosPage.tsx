import React, {
  useEffect,
  useState
} from "react";

import Topbar from "../components/Topbar";
import deleteIcon from "../assets/delete.svg";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const [usuarios,
    setUsuarios] = useState<Usuario[]>([]);

  const listarUsuarios = async () => {
    try {

      const data =
        await UsuarioPageService.listarUsuarios();

      setUsuarios(data);

    } catch (error) {

      console.error(error);
    }
  };

  const deletarUsuario = async (
    id: number
  ) => {

    const resultado = await Swal.fire({
      title: "Confirmar exclusão",
      text: "Deseja realmente deletar este usuário?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    });

    if (!resultado.isConfirmed) return;

    try {

      await UsuarioPageService.deletarUsuario(id);

      setUsuarios(
        usuarios.filter(
          (u) => u.id !== id
        )
      );

      await Swal.fire({
        title: "Usuário removido",
        text: "O usuário foi deletado com sucesso.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });

    } catch (error) {

      console.error(error);

      await Swal.fire({
        title: "Erro",
        text: "Não foi possível deletar o usuário.",
        icon: "error",
        confirmButtonText: "Fechar",
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

          <div
            key={user.id}
            style={{
              position: "relative"
            }}
          >

            <UsuarioCard
              usuario={{
                id: user.id,
                nome: user.name,
                email: user.email,
                role: user.isAdmin
                  ? "ADMIN"
                  : "USER",
                dataCadastro:
                  user.dataCadastro,
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
              title="Deletar usuário"
              onClick={() =>
                deletarUsuario(user.id)
              }
            >
              <img
                src={deleteIcon}
                alt="Deletar"
                style={{
                  width: "24px"
                }}
              />
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default UsuariosPage;