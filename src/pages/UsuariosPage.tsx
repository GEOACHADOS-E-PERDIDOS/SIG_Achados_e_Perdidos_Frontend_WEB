import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../components/Topbar";
import deleteIcon from "../assets/delete.svg";
import { useNavigate } from "react-router-dom";
import "../styles/Objetos.css"; // você pode criar UsuarioPage.css se quiser
import UsuarioCard from "../components/UsuarioCard";

interface Usuario {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  dataCadastro: string;
}

function UsuariosPage() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const token = localStorage.getItem("token");

  const irParaHome = () => navigate("/home");
  const sair = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Buscar todos os usuários
  const listarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:8080/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
    }
  };

  // Deletar usuário
  const deletarUsuario = async (id: number) => {
    if (!window.confirm("Deseja realmente deletar este usuário?")) return;

    try {
      await axios.delete(`http://localhost:8080/usuario/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert("Não foi possível deletar o usuário.");
    }
  };

  const tornarAdmin = async (id: number) => {

  try {

    await axios.put(
      `http://localhost:8080/usuario/${id}/tornar-admin`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    listarUsuarios();

  } catch (error) {

    console.error("Erro ao tornar admin:", error);

    alert("Não foi possível promover o usuário.");
  }
};

  useEffect(() => {
    listarUsuarios();
  }, []);

  return (
  <div className="home-page">

    {/* TOPO */}
    <Topbar />

    {/* LISTA DE USUÁRIOS */}
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
              dataCadastro: user.dataCadastro,
            }}
            onTornarAdmin={tornarAdmin}
          />

          {/* Ícone deletar */}
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
            onClick={() => deletarUsuario(user.id)}
          >

            <img
              src={deleteIcon}
              alt="Deletar"
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