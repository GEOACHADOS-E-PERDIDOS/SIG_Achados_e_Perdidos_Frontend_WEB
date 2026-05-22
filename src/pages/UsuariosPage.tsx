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

    if (
      !window.confirm(
        "Deseja realmente deletar este usuário?"
      )
    ) return;

    try {

      await UsuarioPageService.deletarUsuario(
        id
      );

      setUsuarios(
        usuarios.filter(
          (u) => u.id !== id
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Não foi possível deletar o usuário."
      );
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